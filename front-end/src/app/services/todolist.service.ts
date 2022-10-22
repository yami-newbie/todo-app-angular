import { TodoItemCreateRequest } from './../../../../share-types/request/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mapTo, Subject, tap } from 'rxjs';
import { serverUrl } from 'src/environments/environment';
import { TodoItem } from '../../../../share-types/modules/todoItem';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private todolist: BehaviorSubject<TodoItem[]> = new BehaviorSubject([] as TodoItem[]);
  private onEdit: Subject<string> = new Subject();

  list: TodoItem[] = []

  constructor(private http: HttpClient) {
    this.getList()
    this.todolist.subscribe(val => this.list = val)
  }

  getList() {
    this.http.get(serverUrl.concat("/todo/list")).subscribe({
      next: (v) => this.todolist.next(v as TodoItem[]),
      error: (err) => console.log,
      complete: () => console.log("complete")
    });
  }

  addItem(newItem: TodoItemCreateRequest) {
    return this.http.post(serverUrl.concat("/todo"), newItem).pipe(map(v => v as TodoItem), tap((v) => {
      this.list.push({ id: v.id, ...newItem });
      this.todolist.next(this.list)
    }))
  }

  updateItem(newValue: TodoItem) {
    return this.http.patch(serverUrl.concat("/todo/" + newValue.id), newValue).pipe(tap(() => {
      this.todolist.next(this.list.map(i => i.id === newValue.id ? newValue : i))
    }))
  }

  deleteItem(id: string) {
    return this.http.delete(serverUrl.concat("/todo/" + id)).pipe(tap(() => {
      this.todolist.next(this.list.filter(i => i.id !== id))
    }))
  }

  onEditItem(id: string) {
    this.onEdit.next(id);
  }

  get TodoList() {
    return this.todolist
  }

  get OnEdit() {
    return this.onEdit
  }
}