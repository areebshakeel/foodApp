import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

export default function SmallButton(props) {

    return(
        <TouchableOpacity onPress={()=>props.navigation.navigate(props.route)}  style={styles.container} >
            <Text style={styles.textColor} >{props.title}</Text>
        </TouchableOpacity>
    )
    
}

const styles= StyleSheet.create({
  
    container:{
        backgroundColor:'#3097FF',
        paddingHorizontal:20,
        paddingVertical:5,
        borderRadius:8,

    },
    textColor:{
        color:'#FFFF',
        width:60,
        textAlign:'center',
        fontSize:12

    }
})