import { createAction, props } from "@ngrx/store";
import { CheckIn } from "src/app/models/check-in.model";
import { User } from "src/app/models/user.model";

export const getAllCheckIns = createAction('[AdminCheckInsComponent] getAllCheckIns');

export const getAllCheckInsSuccess = createAction('[CheckInsEffects] getAllCheckInsSuccess', props<{ count: number, rows: CheckIn[] }>());

export const getAllCheckInsFailure = createAction('[CheckInsEffects] getAllCheckInsFailure', props<{ error: any }>());

export const getCheckInsByUserId = createAction('[AdminCheckInsComponent] getCheckInsByUserId', props<{ userId: number }>());

export const getCheckInsByUserIdSuccess = createAction('[CheckInsEffects] getCheckInsByUserIdSuccess', props<{ checkIns: CheckIn[] }>());

export const getCheckInsByUserIdFailure = createAction('[CheckInsEffects] getCheckInsByUserIdFailure', props<{ error: any }>());

export const createCheckInForUser = createAction('[EmployeeCheckInsComponent] createCheckInForUser', props<{ checkIn: CheckIn }>());

export const createCheckInForUserFailure = createAction('[CheckInsEffects] createCheckInForUserFailure', props<{ error: any }>());

export const updateCheckIn = createAction('[EmployeeCheckInsComponent] updateCheckInForUser', props<{ checkIn: CheckIn, refreshAll: boolean }>());

export const updateCheckInForFailure = createAction('[CheckInsEffects] updateCheckInForUserFailure', props<{ error: any }>());

export const deleteCheckIn = createAction('[EmployeeCheckInsComponent] deleteCheckIn', props<{ checkInId: number }>());

export const deleteCheckInFailure = createAction('[CheckInsEffects] deleteCheckInFailure', props<{ error: any }>());

export const changeCheckInSelectedUser = createAction('[AdminCheckInsComponent] changeCheckInSelectedUser', props<{ user: User }>());