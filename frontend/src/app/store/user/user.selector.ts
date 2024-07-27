import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.state';

export const selectUserState = (state: AppState) => state.users?.userState;

export const selectUsersList = (state: AppState) => state.users?.usersList;

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
  selectUserState,
  (userState: UserState) => userState?.isUserConnected
)

export const selectCurrentUserId = createSelector(
  selectUserState,
  (userState: UserState) => userState?.userId
)

export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user?.firstName + ' ' + user?.lastName
);

export const selectUsersListRows = createSelector(
  selectUsersList,
  (usersList) => usersList?.rows
)