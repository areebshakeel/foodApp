import { menuActionTypes } from './menuActionTypes'

const INITIAL_STATE = {
    loading: false,
    error: null

}

const menuReducer = (State = INITIAL_STATE, action) => {

    switch (action.type) {
        case menuActionTypes.GET_MENU_REQUEST:
            return {
                ...State,
                loading: true,
                error: null
            }
        case menuActionTypes.GET_MENU_SUCCESS:
            return {
                ...State,
                loading: false,
                error: null
            }
        case menuActionTypes.GET_MENU_FAILED:
            return {
                ...State,
                loading: false,
                error: action.data

            }
        default:
            return {
                ...State
            }
    }
}

export default menuReducer