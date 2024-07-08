import { Component, DestroyRef, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../task/task.model';

@Component({
  selector: 'app-new-task',
  standalone: true,
  templateUrl: './newTask.component.html',
  styleUrl: './newTask.component.scss',
  imports: [ReactiveFormsModule, RouterLink],
})
export class NewTaskComponent {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  userId = input.required<string>();

  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
    }),
    summary: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const task: Task = {
      id: `u${Math.random()}`,
      userId: this.userId(),
      title: this.form.controls.title.value || '',
      summary: this.form.controls.summary.value || '',
      status: 'open',
      dueDate: new Date().toISOString(),
    };

    const subscription = this.tasksService.addNewTask(task).subscribe({
      next: () => {
        this.router.navigate(['/users', this.userId(), 'tasks'], {
          replaceUrl: true,
        });
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onClear() {
    this.form.reset();
  }

  get titleIsInvalid() {
    return (
      this.form.controls.title.touched &&
      this.form.controls.title.dirty &&
      this.form.controls.title.invalid
    );
  }

  get summaryIsInvalid() {
    return (
      this.form.controls.summary.touched &&
      this.form.controls.summary.dirty &&
      this.form.controls.summary.invalid
    );
  }
}
