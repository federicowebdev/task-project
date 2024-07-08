import { Component, computed, inject } from '@angular/core';

import { UsersService } from './users.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class UsersComponent {
  private usersService = inject(UsersService);
  usersList = computed(() => this.usersService.getUsers());
}
