import { cartActionTypes } from './cartActionTypes'
const INITIAL_STATE = {
    count: 0
}

const cartReducer = (state = INITIAL_STATE, action) => {
    console.log('reducer state-->> ', action)
    switch (action.type) {

        case cartActionTypes.INCREMENT:
            return { count: state.count + 1 }
        case cartActionTypes.DECREMENT:
            return { count: state.count - 1 }
        default:
            return state
    }

}
export default cartReducer