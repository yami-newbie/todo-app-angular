import { endpoint } from './../../environments/environment';
import { TodoItemCreateRequest } from './../../../../share-types/request/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mapTo, Subject, tap } from 'rxjs';
import { serverUrl } from 'src/environments/environment';
import { TodoItem } from '../../../../share-types/modules/todoItem';

// export type Status = 'all' | 'complete' | 'incomplete';
export enum Status {
  all = 'all',
  complete = 'complete',
  incomplete = 'incomplete'
}
// export type Action = 'add' | 'update' | 'delete'
export enum Action {
  add = 'add',
  update = 'update',
  delete = 'delete'
}
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

  onStatus: Status = Status.all;

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

  private fetchData(status: Status) {
    switch (status) {
      case Status.all:
        this.selected = this.allList;
        this.getAllList();
        break;
      case Status.complete:
        this.selected = this.completeList;
        this.getCompleteList();
        break;
      case Status.incomplete:
        this.selected = this.incompleteList;
        this.getIncompleteList();
        break;
      default:
        break;
    }
  }

  private getAllList() {
    this.http.get([serverUrl, endpoint.list].join("/")).subscribe({
      next: (v) => this.allList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("all")
    });
  }

  private getCompleteList() {
    this.http.get([serverUrl, endpoint.list].join("/"), { params: { status: true } }).subscribe({
      next: (v) => this.completeList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("complete")
    });
  }

  private getIncompleteList() {
    this.http.get([serverUrl, endpoint.list].join("/"), { params: { status: false } }).subscribe({
      next: (v) => this.incompleteList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("incomplete")
    });
  }

  addItem(newItem: TodoItemCreateRequest) {
    return this.http.post([serverUrl, endpoint.todo].join("/"), newItem).pipe(map(v => v as TodoItem), tap((v) => {
      switch (this.onStatus) {
        case Status.all:
          this.sendUpdateMessage(v, Action.add);
          break;
        case Status.complete:
          if (newItem.status)
            this.sendUpdateMessage(v, Action.add);
          break;
        case Status.incomplete:
          if (!newItem.status)
            this.sendUpdateMessage(v, Action.add);
          break;
        default:
          break;
      }
    }))
  }

  updateItem(newValue: TodoItem) {
    return this.http.patch(serverUrl.concat([serverUrl, endpoint.todo, newValue.id].join("/")), newValue).pipe(tap(() => {
      switch (this.onStatus) {
        case Status.all:
          this.sendUpdateMessage(newValue, Action.update);
          break;
        case Status.complete:
          if (newValue.status)
            this.sendUpdateMessage(newValue, Action.update);
          else
            this.sendUpdateMessage(newValue, Action.delete);
          break;
        case Status.incomplete:
          if (!newValue.status)
            this.sendUpdateMessage(newValue, Action.update);
          else
            this.sendUpdateMessage(newValue, Action.delete);
          break;
        default:
          break;
      }
    }))
  }

  deleteItem(item: TodoItem) {
    return this.http.delete([serverUrl, endpoint.todo, item.id].join("/")).pipe(tap(() => {
      this.sendUpdateMessage(item, Action.delete);
    }))
  }

  onEditItem(id: string) {
    this.onEdit.next(id);
  }

  changeStatusSort(_status: string) {
    this.onStatus = _status as Status;
    this.fetchData(_status as Status);
  }

  private sendUpdateMessage(newValue: TodoItem, status: Action) {
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