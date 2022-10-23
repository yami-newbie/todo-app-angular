import { TodoItemCreateRequest } from './../../../../share-types/request/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mapTo, Subject, tap } from 'rxjs';
import { serverUrl } from 'src/environments/environment';
import { TodoItem } from '../../../../share-types/modules/todoItem';

export type Status = 'all' | 'complete' | 'incomplete';
export type Action = 'add' | 'update' | 'delete'
export interface UpdateMessage {
  action: Action,
  item: TodoItem
}
@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private allList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);
  private completeList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);
  private incompleteList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);

  private onEdit: Subject<string> = new Subject();
  private updateStream: Subject<UpdateMessage> = new Subject();
  private selected = this.allList;

  onStatus: Status = 'all';

  list: TodoItem[] = []

  constructor(private http: HttpClient) {
    const sub = {
      next: (val: TodoItem[]) => {
        this.list = val;
      },
      error: (err: any) => {
        console.log("error", err.message);
      },
      complete: () => {
        console.log("complete");
      }
    }

    this.allList.subscribe(sub)
    this.completeList.subscribe(sub)
    this.incompleteList.subscribe(sub)
  }

  private fetchData() {
    switch (this.onStatus) {
      case 'all':
        this.selected = this.allList;
        this.getAllList();
        break;
      case 'complete':
        this.selected = this.completeList;
        this.getCompleteList();
        break;
      case 'incomplete':
        this.selected = this.incompleteList;
        this.getIncompleteList();
        break;
      default:
        break;
    }
  }

  private getAllList() {
    this.http.get(serverUrl.concat("/todo/list")).subscribe({
      next: (v) => this.allList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("all")
    });
  }

  private getCompleteList() {
    this.http.get(serverUrl.concat("/todo/list"), { params: { status: true } }).subscribe({
      next: (v) => this.completeList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("complete")
    });
  }

  private getIncompleteList() {
    this.http.get(serverUrl.concat("/todo/list"), { params: { status: false } }).subscribe({
      next: (v) => this.incompleteList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("incomplete")
    });
  }

  addItem(newItem: TodoItemCreateRequest) {
    return this.http.post(serverUrl.concat("/todo"), newItem).pipe(map(v => v as TodoItem), tap((v) => {
      this.sendUpdateMessage(v, 'add');
    }))
  }

  updateItem(newValue: TodoItem) {
    return this.http.patch(serverUrl.concat("/todo/" + newValue.id), newValue).pipe(tap(() => {
      this.sendUpdateMessage(newValue, 'update');
    }))
  }



  deleteItem(item: TodoItem) {
    return this.http.delete(serverUrl.concat("/todo/" + item.id)).pipe(tap(() => {
      this.sendUpdateMessage(item, 'delete');
    }))
  }

  onEditItem(id: string) {
    this.onEdit.next(id);
  }

  changeStatusSort(_status: Status) {
    this.onStatus = _status;
    this.fetchData();
  }

  private sendUpdateMessage(newValue: TodoItem, status: Action) {
    if (this.onStatus === 'all' || (this.onStatus === 'complete' && newValue.status === true) || (this.onStatus === 'incomplete' && newValue.status === false))
      this.updateStream.next({
        action: status,
        item: newValue
      });
  }

  get Selected() {
    return this.selected.asObservable()
  }

  get OnEdit() {
    return this.onEdit.asObservable()
  }

  get UpdateStream() {
    return this.updateStream.asObservable()
  }
}