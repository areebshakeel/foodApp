import React, { useState } from 'react'
import {View, Text} from 'react-native'
import AddMethod from './addMethod'
// import ScanYourCard from './scanYourCard'


export default function PaymentMethod(){
    const [flag, setFlag] = useState(true)
return(
    <View>
        {/* { flag?<ScanYourCard/>: <AddMethod/>} */}
        <AddMethod/>
        {/* <ScanYourCard/> */}
    </View>
)
}

