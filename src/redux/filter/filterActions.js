import {filterActionTypes} from './filterActionTypes'
import axios from 'axios'
import {path} from '../../config/path'

const options = {

    Headers: {
        "Authorization": `Bearer`,
        "Content- Type": 'application / x - www - form - urlencoded',
        "Accept": 'application / json'
    }

}
export function filterRequest() {
    return(dispatch=>{
        axios.post(path.FILTER_API,).then((res)=>{
            return dispatch({
                type:filterActionTypes.FILTER_SUCCESS,
                res
            })
        }).catch((error)=>{
            
        })
    })
    
}

export const filterSuccess = async (body) => {
    return {
        type: filterActionTypes.FILTER_SUCCESS,
        data: body
    }
}

export const filterFailed = (body) => ({
    return: {
        type: filterActionTypes.FILTER_FAILED,
        data: body
    }
})