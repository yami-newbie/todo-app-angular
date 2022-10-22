import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
type ThemeApp = 'primary' | 'accent';

@Injectable({
  providedIn: 'root',
})


export class AppThemeService {
  private darkmode = new BehaviorSubject<ThemeApp>('primary');
  private menu = new BehaviorSubject<boolean>(true);
  constructor() { }

  get Theme() {
    return this.darkmode.asObservable()
  }

  changeTheme() {
    this.darkmode.next(this.darkmode.value === 'accent' ? 'primary' : 'accent')
  }

  switchMenu() {
    this.menu.next(!this.menu.value)
  }

  get streamMenu() {
    return this.menu.asObservable()
  }
}
