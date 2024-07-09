import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.state';

export const selectUserState = (state: AppState) => state.users?.userState;

export const selectCurrentUser = createSelector(
    selectUserState,
  (state: UserState) => state?.user
);

export const selectCurrentToken = createSelector(
    selectUserState,
  (state: UserState) => state?.token
);

export const selectUserRole = createSelector(
    selectCurrentUser,
  (user) => user?.role
);

export const isUserConnected = createSelector(
  selectCurrentToken,
  (token: string) => token !== null
)

export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user?.firstName + ' ' + user?.lastName
);