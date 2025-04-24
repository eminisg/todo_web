import { Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UpdateComponent} from './components/update/update.component';

export const routes: Routes = [
  {path:'', component: DashboardComponent},
  {path:'update', component: UpdateComponent},
];
