import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Task } from './task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  standalone: true,
  imports: [DatePipe],
})
export class TaskComponent {
  @ViewChild('status') status!: ElementRef;
  @ViewChild('taskRef') taskRef!: ElementRef;

  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  task = input.required<Task>();
  onSelect = output<string>();

  statusOption = computed(() => this.task().status);
  selectedStatus: string = '';

  onChange() {
    this.selectedStatus = this.status.nativeElement.value;
    this.setTaskStatus();
  }

  setTaskStatus() {
    const subscription = this.tasksService
      .setTaskStatus(this.task(), this.selectedStatus)
      .subscribe({
        next: () => {
          this.taskRef.nativeElement.classList.remove('open', 'in-progress', 'completed');
          this.taskRef.nativeElement.classList.add(this.selectedStatus);
          this.onSelect.emit('refresh');
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
