// DEV URL
// const BASE_URL = 'https://devfoodapp.m3tech.com.pk/public/api/' 

// STAGING URL
const BASE_URL = 'https://sg-vendor.onlinetestingserver.com/api/'

export const path = {
  LOGIN_API: `${BASE_URL}login`,
  HOME_FEED_API: `${BASE_URL}getHomeFeed`,
  GET_NEAR_BY_RESTURANTS_API: `${BASE_URL}getNearbyRestaurants`,
  GET_DEALS_API: `${BASE_URL}getDeals`,
  FILTER_API: `${BASE_URL}getItemsFiltered `,
  FAVORITES_API: `${BASE_URL}getFavorites`,
  MENU_API: `${BASE_URL}getMenu`,
  ITEM_DETAILS_API: `${BASE_URL}getItemDetails`,
  GET_FILTER_CATEGORIES_API : `${BASE_URL}getCategories`,
  GET_FILTER_FOOD_GROUPS_API : `${BASE_URL}getFoodGroups`,
  GET_FILTER_RESTAURANT : `${BASE_URL}getFilteredRestaurant`,
  SEND_OTP : `${BASE_URL}sendOtp`,
  VERIFY_OTP : `${BASE_URL}verifyOtp`,
  REGISTER_USER:`${BASE_URL}registerUser`,
  GET_PROFILE: `${BASE_URL}getProfile`,
  ADD_VEHICLE: `${BASE_URL}addVehicle`,
  LOGOUT_API:`${BASE_URL}logout`,
  GET_VEHICLE_API:`${BASE_URL}getVehicle`,
  UPDATE_VEHICLE_API: `${BASE_URL}updateVehicle`,
  FORGET_PASSWORD: `${BASE_URL}forgetPassword`,
  CHANGE_PASSWORD_API:`${BASE_URL}changePassword`,
  PRIVACY_POLICY : `${BASE_URL}getPrivacyPolicy`,
  TERMS_AND_CONDITION : `${BASE_URL}getDisclaimer`,
  DELETE_VEHICLE_API:`${BASE_URL}deleteVehicle`,
  EDIT_PROFILE_API : `${BASE_URL}updateProfile`,
  PLACE_ORDER_API : `${BASE_URL}placeOrder`,
  MARK_FAV_API : `${BASE_URL}markFavouriteRestaurant`,
  REMOVE_FAV_API: `${BASE_URL}removeFavouriteRestaurant`,
  MENU_AUTHENTICATED_API: `${BASE_URL}getMenuAuthenticated`,
  HOME_AUTHENTIATED_API:`${BASE_URL}getHomeFeedAuthenticated`,
  GET_ORDER_HISTORY_API : `${BASE_URL}getOrderHistory`,
  master_restaurants : `${BASE_URL}getRestaurantMaster`,
  get_reviews : `${BASE_URL}getReviews`,
  getOrderDetails : `${BASE_URL}getOrderDetails`,
  getActiveOrders : `${BASE_URL}getActiveOrders`,
  changeOrderStatus : `${BASE_URL}changeOrderStatus`,
  ORDER_DETAILS : `${BASE_URL}getOrderDetails`,
  CHECK_EMAIL : `${BASE_URL}checkEmail`,
  checkAddress : `${BASE_URL}checkAddress`,
  createAddress : `${BASE_URL}createAddress`,
  getAddress : `${BASE_URL}getAddress`,
  getNotifications :`${BASE_URL}getNotifications`,
  markAsReadNotification: `${BASE_URL}markAsReadNotification`,
  getDisputedOrders: `${BASE_URL}getDisputedOrders`,
  verifyPromoCode:`${BASE_URL}verifyPromoCode`,
  getDealItems:`${BASE_URL}getDealItems`
}
