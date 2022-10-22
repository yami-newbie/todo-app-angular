import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription, switchMap, of, fromEvent } from 'rxjs';
import { TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';
import { TodoItemCreateRequest } from '../../../../../share-types/request';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() item!: TodoItem;

  @ViewChild('itemStatus', { static: true }) checkBox!: ElementRef;
  @ViewChild('deleteBtn', { static: true }) deleteBtn!: ElementRef;
  @ViewChild('editBtn', { static: true }) editBtn!: ElementRef;

  isEdit: boolean = false;

  inputSub!: Subscription;
  deleteBtnSub!: Subscription;
  editBtnSub!: Subscription;

  constructor(private readonly todoService: TodolistService) {
    todoService.OnEdit.subscribe(val => { this.isEdit = this.item.id === val })
  }

  updateItem(data: TodoItemCreateRequest) {
    this.todoService.updateItem({ ...data, id: this.item.id }).subscribe(
      () => this.todoService.onEditItem("")
    )
  }

  ngOnDestroy(): void {
    this.inputSub.unsubscribe();
    this.deleteBtnSub.unsubscribe();
    this.editBtnSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.inputSub = fromEvent(this.checkBox.nativeElement, 'click')
      .pipe(switchMap(() =>
        this.todoService.updateItem({ ...this.item, status: !this.item.status })
      )).subscribe(console.log)

    this.deleteBtnSub = fromEvent(this.deleteBtn.nativeElement, 'click')
      .pipe(switchMap(() =>
        this.todoService.deleteItem(this.item.id)
      )).subscribe(console.log)

    this.editBtnSub = fromEvent(this.editBtn.nativeElement, 'click')
      .pipe(switchMap(() => of(this.item)))
      .subscribe(() => {
        if (!this.isEdit) {
          this.todoService.onEditItem(this.item.id)
        }
        else {
          this.todoService.onEditItem("")
        }
      })
  }

  ngOnInit(): void {
  }

}
