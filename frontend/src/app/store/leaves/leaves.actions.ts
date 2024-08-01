import { createAction, props } from "@ngrx/store";
import { Leave } from "src/app/models/leave.model";


export const getAllLeaves = createAction('[AdminLeavesComponent] getAllLeaves');

export const getAllLeavesSuccess = createAction('[LeavesEffects] getAllLeavesSuccess', props<{ count: number, rows: Leave[] }>());

export const getAllLeavesFailure = createAction('[LeavesEffects] getAllLeavesFailure', props<{ error: any }>());

export const getLeavesByUserId = createAction('[EmployeeLeavesComponent] getLeavesByUserId', props<{ userId: number }>());

export const getLeavesByUserIdSuccess = createAction('[LeavesEffects] getLeavesByUserIdSuccess', props<{ leaves: Leave[] }>());

export const getLeavesByUserIdFailure = createAction('[LeavesEffects] getAllLeavesFailure', props<{ error: any }>());

export const createLeaveForUser = createAction('[EmployeeLeavesComponent] createLeaveForUser', props<{ leave: Leave }>());

export const createLeaveForUserFailure = createAction('[LeavesEffects] createLeaveForUserFailure', props<{ error: any }>());

export const updateLeave = createAction('[EmployeeLeavesComponent] updateLeaveForUser', props<{ leave: Leave, refreshAll: boolean }>());

export const updateLeaveForFailure = createAction('[LeavesEffects] updateLeaveForUserFailure', props<{ error: any }>());

export const deleteLeave = createAction('[EmployeeLeavesComponent] deleteLeave', props<{ leaveId: number}>());

export const deleteLeaveFailure = createAction('[LeavesEffects] deleteLeaveFailure', props<{ error: any }>());