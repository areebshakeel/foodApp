import {userActionTypes} from './userActionTypes'

const INITIAL_STATE={
    loading:false,
    error:null,

}

 const userReducer=(state=INITIAL_STATE, action)=>{
    // console.log('action----> ',action.data)

    switch(action.type){
        // console.log('actiondata-->>>>',action)
        
        case userActionTypes.USER_LOGIN_REQUEST:
            // console.log('action----> ',action.data)

            return{
                ...state,
                error:null,
                loading:true
                
            }
        case userActionTypes.USER_LOGIN_SUCCESS:
            // console.log('action in userReducer----> ',action)

            const {userDetails:{token}}=action
            // console.log('Action ka dataa-->> ',token)
            return{
                ...state,
                user:token,
                loading:false,
                error:null
            }
       case userActionTypes.USER_LOGIN_FAILED:
            return{
                error:action.error,
                loading:false
            }         
        default: {
            return {...state};
            }
        
    }

}

export default userReducer