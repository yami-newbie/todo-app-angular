import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListItemComponent } from './components/list-todo/list-item/list-item.component';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { MaterialExampleModule } from 'src/material.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CompleteItemPageComponent } from './components/complete-item-page/complete-item-page.component';
import { IncompleteItemPageComponent } from './components/incomplete-item-page/incomplete-item-page.component';
import { AllItemPageComponent } from './components/all-item-page/all-item-page.component';
import { ArrayPipe } from './pipes/array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ListItemComponent,
    ListTodoComponent,
    HomePageComponent,
    TodoFormComponent,
    CompleteItemPageComponent,
    IncompleteItemPageComponent,
    AllItemPageComponent,
    ArrayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
