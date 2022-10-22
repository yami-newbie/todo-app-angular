import { ROUTER } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CompleteItemPageComponent } from './components/complete-item-page/complete-item-page.component';
import { IncompleteItemPageComponent } from './components/incomplete-item-page/incomplete-item-page.component';
import { AllItemPageComponent } from './components/all-item-page/all-item-page.component';

export const routes: Routes = [
  {
    path: ROUTER.default,
    component: HomePageComponent
  },
  {
    path: ROUTER.home,
    component: HomePageComponent,
    children: [
      {
        path: ROUTER.all,
        component: AllItemPageComponent
      },
      {
        path: ROUTER.complete,
        component: CompleteItemPageComponent
      },
      {
        path: ROUTER.incomplete,
        component: IncompleteItemPageComponent
      },
    ]
  },
  {
    path: "**",
    redirectTo: ROUTER.default
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
