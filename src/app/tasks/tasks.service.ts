import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { Task } from './task/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks = signal<Task[]>([]);
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  allTasks = this.tasks.asReadonly();

  loadTasks() {
    return this.fetchTasks('tasks', 'Error: loadTasks');
  }

  private fetchTasks(url: string, errorMessage: string) {
    return this.httpClient.get<{ tasks: Task[] }>(`${this.baseUrl}/${url}`).pipe(
      map((resData) => resData.tasks),
      catchError((error) =>
        throwError(() => {
          console.log(errorMessage);
          return new Error(errorMessage);
        })
      )
    );
  }

  setTaskStatus(task: Task, status: string) {
    const prevTasks = this.tasks();

    return this.httpClient
      .put(`${this.baseUrl}/tasks`, {
        taskId: task.id,
        status: status,
      })
      .pipe(
        catchError((error) => {
          this.tasks.set(prevTasks);
          console.log(error.message);
          return throwError(() => new Error(error));
        }),
        tap({
          next: () => {
            this.tasks.update((prev) => prev.filter((task) => task.status !== 'completed'));
          },
        })
      );
  }

  addNewTask(task: Task) {
    const prevTasks = this.tasks();

    return this.httpClient
      .post(`${this.baseUrl}/tasks`, {
        task: task,
      })
      .pipe(
        catchError((error) => {
          this.tasks.set(prevTasks);
          console.log(error.message);
          return throwError(() => new Error(error));
        }),
        tap({
          next: () => {
            if (this.tasks().some((t) => t.id !== task.id)) {
              this.tasks.update((prevTask) => [...prevTask, task]);
            }
          },
        })
      );
  }
}
