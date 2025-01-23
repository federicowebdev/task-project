import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { UsersService } from '../users/users.service';
import { TasksService } from './tasks.service';
import { Task } from './task/task.model';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  standalone: true,
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent implements OnInit {
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);

  // userId = input.required<string>();
  // tasks = signal<Task[]>([]);
  tasks: Task[] = [];
  httpClient = inject(HttpClient);
  isFetching = signal(false);
  error = signal('');
  userName: string | undefined = '';
  userId: string | undefined = '';
  allTasks = this.tasksService.allTasks;

  constructor() {
    effect(() => {
      // console.log('signal changed!');

      if (this.allTasks().length <= 0) {
        return;
      }

      this.tasks = this.allTasks().filter(
        (task) => task.userId === this.userId && task.status !== 'completed'
      );
      this.tasks.sort((a, b) => {
        return a.dueDate > b.dueDate ? -1 : 1;
      });
    });
  }

  ngOnInit(): void {
    const activatedSubscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.isFetching.set(true);
        this.userId = paramMap.get('userId')?.toString();
        this.userName = this.usersService.getUserById(this.userId)?.name || '';
        this.getUserTasks();
      },
    });

    this.destroyRef.onDestroy(() => {
      activatedSubscription.unsubscribe();
    });
  }

  getUserTasks() {
    const subscription = this.tasksService.loadTasks().subscribe({
      // next: (value) => {
      //   const userTasks: Task[] = value.filter(
      //     (task) => task.userId === this.userId && task.status !== 'completed'
      //   );
      //   userTasks.sort((a, b) => {
      //     return a.dueDate > b.dueDate ? 1 : -1;
      //   });
      //   this.tasks.set(userTasks);
      // },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
