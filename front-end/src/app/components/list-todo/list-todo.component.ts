import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Status, TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit, OnDestroy {
  list: TodoItem[] = []
  @Input() option!: Status;

  subscription!: Subscription;

  constructor(private readonly todoService: TodolistService) {
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.todoService.changeStatusSort(this.option)
    this.subscription?.unsubscribe();
    if (this.option === 'all')
      this.subscription = this.todoService.TodoList.subscribe(val => this.list = val)
    if (this.option === 'complete')
      this.subscription = this.todoService.CompleteList.subscribe(val => this.list = val)
    if (this.option === 'incomplete')
      this.subscription = this.todoService.IncompleteList.subscribe(val => this.list = val)
  }
}
