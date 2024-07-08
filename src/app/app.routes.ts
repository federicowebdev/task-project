import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { routes as userRoutes } from './users/user.routes';

export const routes: Routes = [
  {
    title: 'home',
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'users/:userId',
    children: userRoutes,
  },
  // {
  //   path: '**',
  //   component: PageNotFound
  // }
];
