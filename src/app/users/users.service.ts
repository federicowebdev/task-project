import { Injectable, OnInit, signal } from '@angular/core';

import { User } from './user.model';
import { USERS } from '../../data/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users = signal<User[]>(USERS);

  getUsers() {
    return this.users();
  }

  getUserById(userId: string | undefined) {
    return this.users().find((user) => user.id === userId);
  }
}
