import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoItemCreateRequest } from '../../../share-types/request';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { AppThemeService } from './services/app-theme.service';
import { TodolistService } from './services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'todo';
  color!: string;

  constructor(
    private readonly themeService: AppThemeService,
    private readonly dialog: MatDialog,
    private readonly todoService: TodolistService,
    private readonly snackbar: MatSnackBar,
  ) {
    themeService.Theme.subscribe(val => this.color = val)
  }


  changeTheme() {
    this.themeService.changeTheme()
  }

  openMenu() {
    this.themeService.switchMenu()
  }

  addItem(data: TodoItemCreateRequest) {
    this.todoService.addItem(data).subscribe()
  }

  openForm() {
    this.dialog.open(TodoFormComponent, {
      data: {
        onSubmit: (val: TodoItemCreateRequest) => {
          this.addItem(val);
          this.dialog.closeAll();
          this.snackbar.open("Thêm ghi chú thành công")
        }
      }
    })
  }
}
