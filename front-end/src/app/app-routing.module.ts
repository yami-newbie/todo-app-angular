import { ROUTER } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  {
    path: ROUTER.default,
    component: HomePageComponent
  },
  {
    path: ROUTER.home,
    component: HomePageComponent
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
