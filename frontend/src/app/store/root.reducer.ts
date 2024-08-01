import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { userReducer } from './user/user.reducers';
import { leavesReducer } from './leaves/leaves.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  users: userReducer,
  leaves: leavesReducer
};