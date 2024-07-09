import { Role } from 'src/app/models/enums/Role.enum';
import { User } from '../../models/user.model';

export const initialUserState: UserState = {
  user: null,
  token: null,
  role: null,
  userId: null
};

export const initialUsers = {
  usersList: null,
  userState: initialUserState
}

export interface Users {
  usersList: User[];
  userState: UserState;
}

export interface UserState {
  user: User | null;
  token: string | null;
  role: Role | null;
  userId: number | null;
}

