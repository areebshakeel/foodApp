import { favoritesActionTypes } from './favoritesActionTypes'
import axios from 'axios'
import { path } from '../../config/path'

export function favoritesRequest(payload) {
    return (dispatch => {
        axios.post(path.FAVORITES_API).then((res) => {
            return dispatch({
                type: favoritesActionTypes.GET_FAVORITES_SUCCESS,
                res
            })
        }).catch((error)=>{
        })
    })
}

export const favoritesSuccess = async (body) => {
    return {
        type: favoritesActionTypes.GET_FAVORITES_SUCCESS,
        data: body
    }

}

export const favoritesFailed = async (body)=>{
    return{
        type: favoritesActionTypes.GET_FAVORITES_FAILED,
        data: body
    }
}