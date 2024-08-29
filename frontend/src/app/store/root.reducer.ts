import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { userReducer } from './user/user.reducers';
import { leavesReducer } from './leaves/leaves.reducer';
import { checkInsReducer } from './checkIn/check-in.reducer';
import { loansReducer } from './loan/loan.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  users: userReducer,
  leaves: leavesReducer,
  checkIns: checkInsReducer,
  loans: loansReducer
};