import { MatButton } from '@angular/material/button';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { of, Subscription, fromEvent, switchMap, debounceTime, tap } from 'rxjs';
import { AppThemeService, ThemeApp } from 'src/app/services/app-theme.service';
import { TodoItemCreateRequest } from '../../../../../share-types/request';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoItem } from '../../../../../share-types/modules/todoItem';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, AfterViewInit {
  @Input() item: TodoItemCreateRequest | undefined;
  @ViewChild('submitBtn', { static: true }) button!: MatButton;
  @ViewChild('form', { static: true }) form!: NgForm;



  color!: ThemeApp
  onSubmit: boolean = false
  data = { body: "", status: false, title: "" } as TodoItemCreateRequest
  buttonSubscription!: Subscription;

  constructor(
    private readonly themeService: AppThemeService,
    public dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: { onSubmit: (data: TodoItem | TodoItemCreateRequest) => void, data?: TodoItem },
  ) {
    themeService.Theme.subscribe(val => this.color = val);

    if (_data.data) this.data = _data.data;
  }

  ngAfterViewInit() {
    this.buttonSubscription = fromEvent(this.button._elementRef.nativeElement, 'click')
      .pipe(tap(() => {
        if (this.form.valid)
          this.onSubmit = true
      }), debounceTime(500), switchMap(() => {
        if (this.item) {
          const value = JSON.stringify(this.item) === JSON.stringify(this.data);
          if (!value)
            this._data.onSubmit(this.data)
        }
        else {
          if (this.data.title !== "" && this.data.body !== "") {
            this._data.onSubmit(this.data)
          }
        }
        return of(this.data)
      }))
      .subscribe(() => this.onSubmit = false);
  }

  ngOnInit(): void {
    if (this.item)
      this.data = { ...this.item }
  }

}
