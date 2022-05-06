import {AppThunk} from "../../../../bll/store";
import {authAPI} from "../../../../dal/api";
import {setProfile} from "../../profile/profile-reducer";
import {setIsAuth} from "../../../../app/app-reducer";


const initState = {
    error: null as null | string,
    isLoading: false
}

export const loginReducer = (state: InitStateType = initState, action: LoginAction): InitStateType => {
    switch (action.type) {
        case "login/SET-ERROR": {
            return {...state, error: action.payload}
        }
        case 'login/CHANGE-IS-LOADING': {
            return {...state, isLoading: action.payload}
        }
        default:
            return state
    }
}

//ACTION CREATOR
export const changeIsLoadingLogin = (payload: boolean) => {
    return {
        type: 'login/CHANGE-IS-LOADING',
        payload
    } as const
}
export const setErrorLogin = (payload: string | null) => {
    return {
        type: 'login/SET-ERROR',
        payload
    } as const
}

//THUNK-CREATOR
export const login = (email: string, password: string): AppThunk<void> => async dispatch => {
    try {
        dispatch(changeIsLoadingLogin(true))
        let res = await authAPI.login(email, password)
        res && dispatch(setProfile(res))
        dispatch(setIsAuth(true));
    } catch (err: Error | unknown) {
        if (err instanceof Error) {
            dispatch(setErrorLogin(err.message))
        } else {
            dispatch(setErrorLogin('An error has occurred'))
            console.error(`An error has occurred. Contact the administrator. Error data: ${err}`)
        }
    } finally {
        dispatch(changeIsLoadingLogin(false))
    }
}

//TYPES
export type InitStateType = typeof initState
export type LoginAction = ChangeIsLoadingLogin | SetErrorLogin
export type ChangeIsLoadingLogin = ReturnType<typeof changeIsLoadingLogin>
export type SetErrorLogin = ReturnType<typeof setErrorLogin>
