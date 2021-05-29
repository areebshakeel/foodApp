import React, { useState } from 'react'
import {View, Text} from 'react-native'
import ForgotPassword from './forgot'
import ResetPassword from './reset'


export default function ForgotPasswordScreen(){

    const [flag, setFlag] = useState(true)
    function flagFalse(){
        setFlag(!flag)
    }
    return(
        <View>
            {flag? <ForgotPassword flagFalse={()=>flagFalse(flag)}  />
            :  <ResetPassword flagFalse={()=>flagFalse(flag)} /> 
        }
            
        </View>
    )
}