import { dealsActionsTypes } from './dealsActionsTypes'
import axios from 'axios'
import { path } from '../../config/path'


export function getDealsRequest(payload) {
    console.log('Payload ins Deals Action-->>', payload)
    let body = { dealId: 1 }
    return (dispatch => {
        axios.post("https://devfoodapp.m3tech.com.pk/public/api/getDeals", body, {
            headers: {
                "Authorization": `Bearer ${payload}`,
                "Content- Type": 'application / x - www - form - urlencoded',
                "Accept": 'application / json'
            }
        }).then((res)=>{
            const {data}=res.data
            return dispatch({
                type: dealsActionsTypes.GET_DEALS_SUCCESS,
                data
            })
        }).catch((error)=>{

        })
        
    })

}

export const getDealsSuccess = (payload) => {
    return dispatch({
        type: dealsActionsTypes.GET_DEALS_SUCCESS,
        data: payload

    })
}

export const getDealsFailed = (payload) => {
    return dispatch({
        type: dealsActionsTypes.GET_DEALS_FAILED,
        data: payload
    })
}
