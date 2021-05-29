import {itemDeatilsActionTypes} from './itemDetailsActionTypes'
const INITIAL_STATE={
    loading:false,
    error:null,

}

const itemDetailsReducer= (state=INITIAL_STATE, action)=>{
switch(action.type){
    case itemDeatilsActionTypes.GET_ITEM_DETAILS_REQUEST:
        return{
            loading:true,
            error: null
        }
    case itemDeatilsActionTypes.GET_ITEM_DETAILS_SUCCESS:
        return{
            loading:false,
            error: null
        }
    case itemDeatilsActionTypes.GET_ITEM_DETAILS_FAILED:
        return{
            loading: false,
            error: action.data,
        }
    default:
        return{
            ...state
        }            
}
}

export default itemDetailsReducer