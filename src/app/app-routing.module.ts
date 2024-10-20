import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent } from './component/login/login.component'
import { HomeComponent} from'./component/home/home.component';
import { DashboardComponent} from './component/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
