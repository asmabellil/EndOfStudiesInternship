import { createReducer, on } from "@ngrx/store";
import { convertStringToRole } from "src/app/utils/utils";
import * as UserActions from './user.actions';
import { initialUsers } from "./user.state";


export const userReducer = createReducer(
    initialUsers,
    
    on(UserActions.connectUserSuccess, (state, { token, decodedToken, user}) => ({ 
        ...state, 
        userState: {
            ...state.userState,
            token, 
            role: convertStringToRole(decodedToken['role']), 
            userId: decodedToken['userId'], 
            user: user,
            isUserConnected: true
        }
    })),

    on(UserActions.disconnectUser, (state) => (initialUsers)),

    on(UserActions.getAllUsersSuccess, (state, { users }) => ({ ...state, usersList: {count: users['count'], rows: users['rows']} })),

    on(UserActions.addUserSuccess, (state, { user }) => ({ ...state, usersList: {count: state.usersList.count + 1, rows: [...state.usersList.rows, user] } })),

    on(UserActions.updateUserSuccess, (state, { user }) => ({...state, usersList: {count: state.usersList.count, rows: state.usersList.rows.map(u => u.id === user.id ? user : u)}})),

    on(UserActions.deleteUserSuccess, (state, { userId }) => ({...state, usersList: {count: state.usersList.count - 1, rows: state.usersList.rows.filter(u => u.id !== userId)}}))
);