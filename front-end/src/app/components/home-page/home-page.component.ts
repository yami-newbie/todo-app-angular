import { debounceTime, exhaustMap, fromEvent, Observable, Subscription } from 'rxjs';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';
import { TodoItemCreateRequest } from '../../../../../share-types/request';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  list: Observable<TodoItem[]>
  isAdd: boolean = false;
  buttonSubscription!: Subscription;

  constructor(private readonly todoService: TodolistService) {
    this.list = todoService.TodoList
  }

  addItem(data: TodoItemCreateRequest) {
    this.todoService.addItem(data).subscribe(() => { this.isAdd = !this.isAdd })
  }

  ngOnInit(): void {
  }

}
