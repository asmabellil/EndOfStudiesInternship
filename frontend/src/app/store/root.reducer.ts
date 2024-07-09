import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { userReducer } from './user/user.reducers';

export const rootReducer: ActionReducerMap<AppState> = {
  users: userReducer,
};