import {menuActionTypes} from './menuActionTypes'
import axios from 'axios'
import {path} from '../../config/path'

export function getMenuRequest(payload) {
    return(dispatch=>{
        axios.post(path.MENU_API).then((res)=>{
            return dispatch({
                type:menuActionTypes.GET_MENU_SUCCESS,
                res
            })
        }).catch((error)=>{
    
        })
    })
    
}

export const getMenuSuccess= async (body)=>{
    return {
        type:menuActionTypes.GET_MENU_SUCCESS,
        data: body
    }

}

export const getMenuFailed = async (body)=>{
    return{
        type: menuActionTypes.GET_MENU_FAILED,
        data: body
    }
}