import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, switchMap, of, fromEvent, debounceTime, tap } from 'rxjs';
import { AppThemeService } from 'src/app/services/app-theme.service';

import { TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../../share-types/modules/todoItem';
import { TodoItemCreateRequest } from '../../../../../../share-types/request';
import { TodoFormComponent } from '../../todo-form/todo-form.component';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() item!: TodoItem;

  @ViewChild('itemStatus', { static: true }) statusCb!: MatCheckbox;
  @ViewChild('deleteBtn', { static: true }) deleteBtn!: MatButton;

  color!: string;

  isEdit: boolean = false;
  onDelete: boolean = false;

  statusSub!: Subscription;
  deleteBtnSub!: Subscription;

  constructor(
    private readonly todoService: TodolistService,
    private readonly themeService: AppThemeService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    todoService.OnEdit.subscribe(val => { this.isEdit = this.item.id === val })
    themeService.Theme.subscribe(val => this.color = val)
  }

  updateItem(data: TodoItemCreateRequest) {
    this.todoService.updateItem({ ...data, id: this.item.id })
      .subscribe(() => {
        this.todoService.onEditItem("");
        this.snackbar.open("Chỉnh sửa thành công")
      })
  }

  ngOnDestroy(): void {
    this.statusSub.unsubscribe();
    this.deleteBtnSub.unsubscribe();
  }

  openDialog() {
    this.dialog.open(TodoFormComponent, {
      data: {
        data: { ...this.item },
        onSubmit: (val: TodoItem) => {
          this.updateItem(val);
          this.dialog.closeAll();
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.statusSub = this.statusCb.change
      .pipe(
        tap(() => this.item = { ...this.item, status: !this.item.status }),
        debounceTime(500),
        switchMap(() => this.todoService.updateItem(this.item)),
      ).subscribe(console.log)

    this.deleteBtnSub = fromEvent(this.deleteBtn._elementRef.nativeElement, 'click')
      .pipe(
        tap(() => this.onDelete = true),
        debounceTime(500),
        switchMap(() => this.todoService.deleteItem(this.item.id))
      ).subscribe(console.log)
  }

  ngOnInit(): void {
  }

}
