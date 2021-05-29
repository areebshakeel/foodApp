import {favoritesActionTypes} from './favoritesActionTypes'



const INITIAL_STATE={
    loading:false,
    error:null,

}

const  favoritesReducer=(state=INITIAL_STATE,action)=> {

    switch (action.type) {
        case favoritesActionTypes.GET_FAVORITES_REQUEST:
            return{
                ...state,
                loading:true,
                error:null
            }
        case favoritesActionTypes.GET_FAVORITES_SUCCESS:
            return{
                ...state,
                loading:false,
                error:null
            }
        case favoritesActionTypes.GET_FAVORITES_FAILED:
            return{
                ...state,
                loading:false,
                error:action.data
            }
        default:
            return{
                ...state
            
        }          
    }
}

export default favoritesReducer