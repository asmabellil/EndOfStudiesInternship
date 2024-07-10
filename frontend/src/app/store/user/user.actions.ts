import { createAction, props } from "@ngrx/store";
import { JwtPayload } from "jwt-decode";
import { User } from "src/app/models/user.model";


export const connectUser = createAction('[LoginComponent] connect', props<{ email: string; password: string }>());

export const connectUserSuccess = createAction('[UserEffects] connectUserSuccess', props<{ token: string, decodedToken: JwtPayload, user: User }>());

export const connectUserFailure = createAction('[UserEffects] connectUserFailure', props<{ error: any }>());

export const disconnectUser = createAction('[NavBarComponent] disconnect');

export const getAllUsersSuccess = createAction('[UserEffects] getAllUsersSuccess', props<{ users: User[] }>());

export const getAllUsersFailure = createAction('[UserEffects] getAllUsersFailure', props<{ error: any }>());

export const addUser = createAction('[DashboardComponent] addUser', props<{ user: User }>());

export const addUserSuccess = createAction('[UserEffects] addUserSuccess', props<{ user: User }>());

export const addUserFailure = createAction('[UserEffects] addUserFailure', props<{ error: any }>());