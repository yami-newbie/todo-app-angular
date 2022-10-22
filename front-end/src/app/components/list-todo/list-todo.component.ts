import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit {

  list: Observable<TodoItem[]>
  constructor(private readonly todoService: TodolistService) {
    this.list = todoService.TodoList
  }

  ngOnInit(): void {
  }

}
