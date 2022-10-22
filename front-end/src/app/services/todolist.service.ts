import { TodoItemCreateRequest } from './../../../../share-types/request/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mapTo, Subject, tap } from 'rxjs';
import { serverUrl } from 'src/environments/environment';
import { TodoItem } from '../../../../share-types/modules/todoItem';

export type Status = 'all' | 'complete' | 'incomplete';
@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private allList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);
  private completeList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);
  private incompleteList: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);

  private onEdit: Subject<string> = new Subject();

  private selected = this.allList;

  onStatus: Status = 'all';

  list: TodoItem[] = []

  constructor(private http: HttpClient) {
    this.allList.subscribe(val => this.list = val)
    this.completeList.subscribe(val => this.list = val)
    this.incompleteList.subscribe(val => this.list = val)
  }

  private fetchData() {
    switch (this.onStatus) {
      case 'all':
        this.getAllList();
        break;
      case 'complete':
        this.getCompleteList();
        break;
      case 'incomplete':
        this.getIncompleteList();
        break;
      default:
        break;
    }
  }

  private getAllList() {
    this.selected = this.allList;

    this.http.get(serverUrl.concat("/todo/list")).subscribe({
      next: (v) => this.allList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("all")
    });
  }

  private getCompleteList() {
    this.selected = this.completeList;

    this.http.get(serverUrl.concat("/todo/list"), { params: { status: true } }).subscribe({
      next: (v) => this.completeList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("complete")
    });
  }

  private getIncompleteList() {
    this.selected = this.incompleteList;

    this.http.get(serverUrl.concat("/todo/list"), { params: { status: false } }).subscribe({
      next: (v) => this.incompleteList.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("incomplete")
    });
  }

  addItem(newItem: TodoItemCreateRequest) {
    return this.http.post(serverUrl.concat("/todo"), newItem).pipe(map(v => v as TodoItem), tap((v) => {
      if (this.onStatus === 'all' || (this.onStatus === 'complete' && newItem.status) || (this.onStatus === 'incomplete' && newItem.status === false))
        this.list.push({ id: v.id, ...newItem });

      this.selected.next(this.list)
    }))
  }

  updateItem(newValue: TodoItem) {
    return this.http.patch(serverUrl.concat("/todo/" + newValue.id), newValue).pipe(tap(() => {
      this.selected.next(this.list.map(i => i.id === newValue.id ? newValue : i))
    }))
  }

  deleteItem(id: string) {
    return this.http.delete(serverUrl.concat("/todo/" + id)).pipe(tap(() => {
      this.selected.next(this.list.filter(i => i.id !== id))
    }))
  }

  onEditItem(id: string) {
    this.onEdit.next(id);
  }

  changeStatusSort(_status: Status) {
    this.onStatus = _status;
    this.fetchData();
  }

  get TodoList() {
    return this.allList.asObservable()
  }

  get IncompleteList() {
    return this.incompleteList.asObservable()
  }

  get CompleteList() {
    return this.completeList.asObservable()
  }

  get OnEdit() {
    return this.onEdit
  }
}