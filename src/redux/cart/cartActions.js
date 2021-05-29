import { cartActionTypes } from './cartActionTypes'

export function incrementCounter(payload) {
    console.log('Data from component', payload)

    return function (diapstch){
        type: cartActionTypes.INCREMENT,
        payload
    }

}

export function decrementCounter() {
    return dispatch({
        type: cartActionTypes.DECREMENT
    })
}