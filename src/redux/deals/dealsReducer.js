import {dealsActionsTypes} from './dealsActionsTypes'

const INITIAL_STATE={
    loading:false,
    error:null
}

const dealsReducer= (state=INITIAL_STATE, action)=>{
    
    switch(action.type){
        case dealsActionsTypes.GET_DEALS_REQUEST:
            // console.log('Deals in reducer-->> ', action)

            return{
                ...state,
                loading:true,
                error:null
            }
        case dealsActionsTypes.GET_DEALS_SUCCESS:
            return{
                ...state,
                loading:false,
                error:null,
                data:action
            }
        case dealsActionsTypes.GET_DEALS_FAILED:
            return{
                loading:false,
                error:action.error,
            }
        default:
            return{...state}            
    }

}

export default dealsReducer