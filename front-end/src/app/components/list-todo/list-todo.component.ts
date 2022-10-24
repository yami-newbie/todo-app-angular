import { Subscription, map } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Status, TodolistService, UpdateMessage } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit, OnDestroy {
  list: TodoItem[] = []
  @Input() option!: string;

  initSubscription!: Subscription;
  updateSubscription!: Subscription;

  constructor(private readonly todoService: TodolistService) {
  }

  initList = {
    next: (val: TodoItem[]) => {
      this.list = val
    },
    error: (err: any) => console.log,
    complete: () => console.log("complete")
  }

  updateList = {
    next: (val: UpdateMessage) => {
      switch (val.action) {
        case 'add':
          this.list.push(val.item)
          break;
        case 'delete':
          this.list = this.list.filter(i => val.item.id !== i.id)
          break;
        case 'update':
          this.list = this.list.map(i => val.item.id === i.id ? val.item : i)
          break;
        default:
          break;
      }
    },
    error: (err: any) => console.log,
    complete: () => console.log("complete")
  }


  ngOnDestroy(): void {
    this.initSubscription.unsubscribe()
    this.updateSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.todoService.changeStatusSort(this.option)
    this.initSubscription = this.todoService.Selected.subscribe(this.initList)
    this.updateSubscription = this.todoService.UpdateStream.subscribe(this.updateList)
  }
}
