import { Routes } from '@angular/router';
import { TasksComponent } from '../tasks/tasks.component';
import { NewTaskComponent } from '../tasks/newTask/newTask.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () => import('../tasks/tasks.component').then((c) => c.TasksComponent),
    // component: TasksComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'tasks/new',
    loadComponent: () =>
      import('../tasks/newTask/newTask.component').then((c) => c.NewTaskComponent),
    // component: NewTaskComponent,
  },
];
