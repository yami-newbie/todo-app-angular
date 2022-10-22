import { MatButton } from '@angular/material/button';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { exhaustMap, of, Subscription, fromEvent, switchMap, take } from 'rxjs';
import { AppThemeService } from 'src/app/services/app-theme.service';
import { TodoItemCreateRequest } from '../../../../../share-types/request';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoItem } from '../../../../../share-types/modules/todoItem';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, AfterViewInit {
  @Input() item: TodoItemCreateRequest | undefined;

  color!: string
  onSubmit: boolean = false
  data = { body: "", status: false, title: "" } as TodoItemCreateRequest
  buttonSubscription!: Subscription;

  @ViewChild('submitBtn', { static: true }) button!: MatButton;

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
      .pipe(switchMap(() => of(this.data)), take(1))
      .subscribe((val) => {
        if (this.item) {
          const value = JSON.stringify(this.item) === JSON.stringify(val);
          if (!value)
            this._data.onSubmit(val)
        }
        else {
          if (val.title !== "" && val.body !== "") {
            this._data.onSubmit(val)
          }
        }
      });
  }

  ngOnInit(): void {
    if (this.item)
      this.data = { ...this.item }
  }

}
