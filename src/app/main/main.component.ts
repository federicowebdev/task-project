import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [RouterOutlet, UsersComponent],
})
export class MainComponent {}
