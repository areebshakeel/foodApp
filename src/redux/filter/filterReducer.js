import {filterActionTypes} from './filterActionTypes'

const INITIAL_STATE={
    loading:false,
    error:null,

}

const filterReducer=(state=INITIAL_STATE, action)=>{
    switch (action.type){
        case filterActionTypes.FILTER_REQUEST:
            return{
                ...state,
                loading:true,
                error:null
            }
        case filterActionTypes.FILTER_SUCCESS:
            return{
                ...state,
                loading:false,
                error:null
            }
            case filterActionTypes.FILTER_FAILED:
                return{
                    ...state,
                    loading:false,
                    error:action.data
                }         
        default:
         return {...state}
             
    }
}

export default filterReducer