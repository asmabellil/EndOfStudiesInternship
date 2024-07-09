import { Role } from 'src/app/models/enums/Role.enum';
import { User } from '../../models/user.model';

export const initialUserState: UserState = {
  user: null,
  token: null,
  role: null,
  userId: null,
  isUserConnected: false
};

export const initialUsers = {
  usersList: {count: -1, rows: null},
  userState: initialUserState
}

export interface Users {
  usersList: {
    count: number;
    rows: User[];
  }
  userState: UserState;
}

export interface UserState {
  user: User | null;
  token: string | null;
  role: Role | null;
  userId: number | null;
  isUserConnected: boolean;
}

