import { ROUTER } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, of, debounceTime, fromEvent, switchMap, concatMap } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import { TodoItem } from '../../../../../share-types/modules/todoItem';
import { TodoItemCreateRequest } from '../../../../../share-types/request';
import { AppThemeService, ThemeApp } from 'src/app/services/app-theme.service';
import { MatDialog } from '@angular/material/dialog';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatSelectionList } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  color!: ThemeApp;
  routes: { path: string, name: string }[] = [
    {
      path: ROUTER.all,
      name: "Tất cả"
    },
    {
      path: ROUTER.complete,
      name: "Hoàn Thành"
    },
    {
      path: ROUTER.incomplete,
      name: "Chưa Hoàn Thành"
    }
  ];

  btnMenuSub!: Subscription;

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('navlink') selectionList!: MatSelectionList;

  constructor(
    private readonly themeService: AppThemeService,
    private readonly router: Router
  ) {
    this.themeService.Theme.subscribe(val => this.color = val)
    this.themeService.streamMenu.subscribe(val => { this.drawer?.toggle(val) })
  }

  ngAfterViewInit(): void {
    this.selectionList.selectionChange.subscribe((val) => {
      this.router.navigate([ROUTER.home, val.options[0].value]);
    })
  }

  navigate(path: string) {
    console.log(path);
  }

  ngOnInit(): void {
  }

}
