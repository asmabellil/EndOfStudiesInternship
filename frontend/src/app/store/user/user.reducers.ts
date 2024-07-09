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
            user: user
        }
    })),

    on(UserActions.disconnectUser, (state, ) => ({ ...state, token: null, role: null, userId: null })),

    on(UserActions.getAllUsersSuccess, (state, { users }) => ({ ...state, usersList: users }))
);