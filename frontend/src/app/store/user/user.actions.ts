import { createAction, props } from "@ngrx/store";
import { JwtPayload } from "jwt-decode";
import { User } from "src/app/models/user.model";


export const connectUser = createAction('[LoginComponent] connect', props<{ email: string; password: string }>());

export const connectUserWithGoogle = createAction('[LoginComponent] connectWithGoogle', props<{ email: string }>());

export const connectUserSuccess = createAction('[UserEffects] connectUserSuccess', props<{ token: string, decodedToken: JwtPayload, user: User }>());

export const connectUserFailure = createAction('[UserEffects] connectUserFailure', props<{ error: any }>());

export const disconnectUser = createAction('[NavBarComponent] disconnect');

export const getAllUsers = createAction('[UserEffects] getAllUsers');

export const getAllUsersSuccess = createAction('[UserEffects] getAllUsersSuccess', props<{ users: User[] }>());

export const getAllUsersFailure = createAction('[UserEffects] getAllUsersFailure', props<{ error: any }>());

export const addUser = createAction('[DashboardComponent] addUser', props<{ user: User }>());

export const addUserFailure = createAction('[UserEffects] addUserFailure', props<{ error: any }>());

export const sendForgotPassword = createAction('[ForgotPasswordComponent] sendForgotPassword', props<{ email: string }>());

export const sendForgotPasswordSuccess = createAction('[UserEffects] sendForgotPasswordSuccess', props<{ message: string }>());

export const sendForgotPasswordFailure = createAction('[UserEffects] sendForgotPasswordFailure', props<{ error: any }>());

export const resetPassword = createAction('[ResetPasswordComponent] resetPassword', props<{ token: string, password: string }>());

export const resetPasswordSuccess = createAction('[UserEffects] resetPasswordSuccess', props<{ message: string }>());

export const resetPasswordFailure = createAction('[UserEffects] resetPasswordFailure', props<{ error: any }>());

export const updateUser = createAction('[DashboardComponent] updateUser', props<{ user: User }>());

export const updateUserFailure = createAction('[UserEffects] updateUserFailure', props<{ error: any }>());

export const deleteUser = createAction('[DashboardComponent] deleteUser', props<{ userId: number }>());

export const deleteUserFailure = createAction('[UserEffects] deleteUserFailure', props<{ error: any }>());