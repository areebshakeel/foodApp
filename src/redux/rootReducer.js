import {combineReducers} from 'redux'
import userReducer from './user/userReducer'
import homeFeedReducer from './homeFeed/homeFeedReducer'
import getNearByResturantsReducer from './getNearbyResturants/getNearByResturantsReducer'
import dealsReducer from './deals/dealsReducer'
import filterReducer from './filter/filterReducer'
// import favoritesReducer from './favorites/favoritesReducer'
import menuReducer from './menu/menuReducer'
import itemDetailsReducer from './itemDetails/itemDetailsReducer'
import cartReducer from './cart/cartReducer'
const rootReducer=   combineReducers({
    userReducer,
    homeFeedReducer,
    getNearByResturantsReducer,
    dealsReducer,
    filterReducer,
    menuReducer,
    itemDetailsReducer,
    cartReducer

})
export default rootReducer
