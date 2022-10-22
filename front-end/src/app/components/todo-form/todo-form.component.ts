import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { exhaustMap, of, Subscription, tap, fromEvent } from 'rxjs';
import { TodoItemCreateRequest } from '../../../../../share-types/request';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, AfterViewInit {
  @Input() item: TodoItemCreateRequest | undefined;
  @Output() formData: EventEmitter<TodoItemCreateRequest> = new EventEmitter();

  data = { body: "", status: false, title: "" } as TodoItemCreateRequest
  buttonSubscription!: Subscription;

  @ViewChild('submitBtn', { static: true }) button!: ElementRef;

  ngAfterViewInit() {
    this.buttonSubscription = fromEvent(this.button.nativeElement, 'click')
      .pipe(exhaustMap(() => of(this.data)))
      .subscribe((val) => {
        if (this.item) {
          const value = JSON.stringify(this.item) === JSON.stringify(val);

          if (!value)
            this.formData.emit(val)
        }
        else {
          if (val.title !== "" && val.body !== "") {
            this.formData.emit(val)
          }
        }
      });
  }

  ngOnInit(): void {
    if (this.item)
      this.data = { ...this.item }
  }

}
