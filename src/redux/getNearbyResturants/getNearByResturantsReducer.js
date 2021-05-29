import {getNearByResturantsActionTypes} from './getNearByResturantsActionTypes'

const INITIAL_STATE={
    loading:false,
    error:null

}

const getNearByResturantsReducer=(state=INITIAL_STATE, action)=>{

  
    switch(action.type){
        case getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_REQUEST:
            return{
                ...state,
                error:null,
                loading:true
            }
        case getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_SUCCESS:
            return{
                ...state,
                error:null,
                loading:false,
                data:action.data
                

            }
        case getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_FAILED:
            return{
                ...state,
                error:action.error,
                loading
            }
       default: {
            return {...state};
            }            
    }

}

export default getNearByResturantsReducer