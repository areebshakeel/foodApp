import {itemDeatilsActionTypes} from './itemDetailsActionTypes'
import axios from 'axios'
import {path} from '../../config/path'

export function itemDetailsRequest(payload) {
return(dispatch=>{
    axios.post(path.ITEM_DETAILS_API).then((res)=>{
        return dispatch({
            type:itemDeatilsActionTypes.GET_ITEM_DETAILS_SUCCESS,
            res
        })
    })
})   
}
export const itemDetailsSuccess = async (body) => {
    return {
        type: itemDeatilsActionTypes.GET_ITEM_DETAILS_SUCCESS,
        data: body
    }
}

export const itemDetailsFailed = async ( body)=>{
    return{
        type: itemDeatilsActionTypes.GET_ITEM_DETAILS_FAILED,
        data: body
    }
}