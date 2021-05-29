import {getNearByResturantsActionTypes} from './getNearByResturantsActionTypes'
import axios from 'axios'
import {path} from '../../config/path'


let body = { lat: 32271.2344, long: 232323.3232 };

export function getNearByResturantsRequest (payload){
console.log('payload in Nearby-->> ', payload)
return (dispatch=>{
    axios.post(path.GET_NEAR_BY_RESTURANTS_API,body,{
        headers: {
            "Authorization": `Bearer ${payload}`,
            "Content- Type": 'application / x - www - form - urlencoded',
            "Accept": 'application / json'
        }
    }).then(res=>{
        const {data}= res.data
          return dispatch({
              type:getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_SUCCESS,
              data
          })  
        }).catch((error)=>{
          
            return(dispatch=>{
                type:getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_FAILED
                error.message
            })
        })
})

}

export const getNearByResturantsSuccess = async (payload) => {
    return {
        type: getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_SUCCESS,
        data: payload
    }
}



export const getNearByResturantsFailed = payload => ({
    type: getNearByResturantsActionTypes.GET_NEAR_BY_RESTURANTS_FAILED,
    payload
})


