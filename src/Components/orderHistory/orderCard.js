import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import MapImage from '../../../assets/map.png'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import StarIcon from 'react-native-vector-icons/FontAwesome'
import SmallButton from './smallButtons'

export default function OrderCard() {
    const star = ['0', '1', '2', '3', '4']
    return (
        <View style={styles.mainContainer} >
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-evenly' }} >
                    <View   >
                        <Image source={MapImage} resizeMode="contain" style={{width:60, borderRadius:4}} />
                    </View>
                    <View >
                        <Text style={styles.itemText1} >KFC</Text>
                        <Text style={styles.itemText2}  >AED 20.00</Text>
                    </View>
                </View>
                <View >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <EntypoIcon color='#C6E2F9' name="location-pin" />
                        <Text style={{
                                color:'#7F7E7F',
                                fontSize: 10,
                                fontFamily: 'Poppins-Regular'
                            }} > Burj Khalifa Dubai</Text>

                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row', marginTop:5 }}>
                        {star.map(item => <StarIcon name="star" size={15} color="#AEAEAE" />
                        )}

                    </View>
                </View>



            </View>
            <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%', marginTop:10, marginBottom:10}}>
                <SmallButton title="Review" />
                <SmallButton title="Reorder" />
                <SmallButton title="View" />

            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'100%',
        padding:4,
        
        // padding: 4,
        borderRadius: 8

    },
    itemText1: {
        color: '#464951',
        fontFamily: 'Poppins-SemiBold',
        fontSize:18
    },
    itemText2: {
        color: '#464951',
        fontFamily: 'Poppins-SemiBold',
        fontSize:14
    },
    mainContainer: {
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        // padding:,
        borderRadius: 8
    }
})
