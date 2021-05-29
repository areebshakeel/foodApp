import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import VehicleImage from '../../images/vehicle-registration-img.png';
import Icon from 'react-native-vector-icons/AntDesign';
import Input from '../../Components/Input';
import Button from '../../Components/Button/index';
import { Container, Content, Toast } from 'native-base';
import Colors from '../../config/colors';
import axios from 'axios';
import { path } from '../../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker'
import { Picker } from 'native-base'
import UAE from '../../images/uae.png'
import IconDown from 'react-native-vector-icons/AntDesign';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function VehicleRegistration({ navigation, route }) {
  const [plateNumber, setPlateNumber] = useState('')
  const [make, setMake] = useState('')
  const [modal, SetModal] = useState('')
  const [year, setYear] = useState('')
  const [color, setColor] = useState('')
  const [country, setCountry] = useState('USA')
  const [photo, setPhoto] = useState(null)
  const [plateColor, setPlateColor] = useState(true)
  const [makeColor, setMakeColor] = useState(true)
  const [modalColor, setModalColor] = useState(true)
  const [yearColor, setYearColor] = useState(true)
  const [colorColor, setColorColor] = useState(true)
  const [loader, setLoader] = useState(false)
  const [numPlateValidation, setNumPlateValidation] = useState(false)
  const [makeValidation, setMakeValidation] = useState(false)
  const [modelValidation, setModelValidation] = useState(false)
  const [yearValidation, setYearValidation] = useState(false)
  const [colorValidation, setColorValidation] = useState(false)
  const [registerError, setRegisterError] = useState(false)
  const [plateCode, setPlateCode] = useState('')
  const togglePlatePicker = useRef(null)
  const toggleColorPicker = useRef(null)

  const carColors = Platform.OS == 'android' ? ["Select Color", "White", "Black", "Blue", "Grey", "Silver", "Red", "Green"] : ["White", "Black", "Blue", "Grey", "Silver", "Red", "Green"]
  const numberPlate = [
    { label: "AUH", value: "AUH" },
    { label: "AJM", value: "AJM" },
    { label: "DXB", value: "DXB" },
    { label: "FUJ", value: "FUJ" },
    { label: "RAK", value: "RAK" },
    { label: "SHJ", value: "SHJ" },
    { label: "UAQ", value: "UAQ" },
  ]
  let numberPlateAndroid = ["AUH", "AJM", "DXB", "FUJ", "RAK", "SHJ", "UAQ"]

  // route.params.token? console.log('Register Token-->> ', route.params.token) : null
  async function addVehicle() {
    // route.params.token? console.log('Register Token-->> ', route.params.token) : null
    setLoader(true)
    if (plateNumber && make && modal && year && color && color !== "Select Color" && country) {
      try {
        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token)

        const form = new FormData()
        form.append('make', make)
        form.append('modal', modal)
        form.append('year', year)
        form.append('color', color)
        form.append('plateNo', plateCode + plateNumber)
        form.append('country', country)
        photo ? form.append('image', photo) : ""
        console.log('Token at add Vehicle-->>> ', TokenValue)
        await axios.post(path.ADD_VEHICLE, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },

        }).then((res) => {
          setLoader(false)

          console.log('Vehicle Registered-->> ', res)
          Toast.show({
            text: res.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
          {
            route.params.register ?
              navigation.navigate('Home')

              :
              navigation.navigate('MyVehicles')
          }
          setPhoto(null)
          setPlateColor(true)
          setMakeColor(true)
          setModalColor(true)
          setYearColor(true)
          setColorColor(true)
        }).catch((e) => {
          setLoader(false)
          Alert.alert('Couldnt register Vehicle')

          console.log('error in vehicle register ', e.response.data)
          setPhoto(null)
          setRegisterError(true)
        })
      } catch (error) {
        console.log(error)
        setLoader(false)

        Alert.alert('Couldnt register Vehicle')
      }
    }
    else {
      setLoader(false)
      if (!plateNumber) {
        setPlateColor(false)
        setNumPlateValidation(true)
      }
      if (!make) {
        setMakeColor(false)
        setMakeValidation(true)
      }
      if (!modal) {
        setModalColor(false)
        setModelValidation(true)
      }
      if (!year) {
        setYearColor(false)
        setYearValidation(true)
      }
      if (!color || color === "Select Vehicle") {
        setColorColor(false)
        setColorValidation(true)
      }
      if (color && color != "Select Vehicle") {
        setColorValidation(false)
      }
    }

  }

  const uploadPicture = () => {
    let options = {
      title: 'Select Image',

    }
    ImagePicker.launchImageLibrary({
      maxWidth: 50,
      maxHeight: 50,
      quality: 0.4
    }, (response) => {
      console.log(response)
      setPhoto(response)
    })
  }




  return (
    <Container>
      <Content style={styles.container}>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View style={styles.arrow2}>
            <Icon onPress={() => navigation.goBack()} name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText2}></Text>
          </View>
          {route.params.register ? <View>
            <Text onPress={() => navigation.navigate('Home')} style={{ color: "#464951", fontFamily: semiBold, fontSize: 20 }}>Skip</Text>
          </View> : <Text> </Text>}

        </View>
        <View style={{ padding: 4, marginTop: 20 }}>
          <Text style={styles.vehicleRegisterText}>Vehicle Registration</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image resizeMode="contain" source={VehicleImage} />
        </View>

        <Text>License Plate Number*</Text>
        <View style={{
          alignSelf: 'center',
          alignItems: "center",
          flexDirection: 'row',
          // justifyContent: 'space-between',
          // flex:1,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#707070",
          width: '100%',
          height: '5%',
          // flex:0.2,
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          marginTop: 20
        }}>

          <Image source={UAE} resizeMode="contain" style={{ width: '10%' }} />
          {/* <Icon style={{ paddingHorizontal: 10 }} name="caretdown" color="#707070" /> */}
          <Text style={{ color: "#707070", paddingHorizontal: 5 }}> UAE</Text>
          {Platform.OS == "android" ? <View style={styles.picker2}>
            <Picker

              style={styles.pickerText}
              mode="dialog"
              selectedValue={plateCode}
              onValueChange={(value) => (setPlateCode(value) && setColorValidation(false) && setColorColor(true))}
            >
              {numberPlateAndroid.map((item) => (
                <Picker.Item label={item} value={item} />
              ))}

            </Picker>
          </View> : null
          }

          {/* // IOS PiCKer // */}
          {Platform.OS == 'ios' &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{
                flex: 0.13,
                // backgroundColor : 'red'
                // justifyContent: 'flex-start'
              }}>
                <RNPickerSelect
                  ref={togglePlatePicker}
                  onValueChange={(value) => setPlateCode(value)}
                  items={numberPlate.map(item => (
                    { label: item.label, value: item.value }
                  ))}
                  useNativeAndroidPickerStyle={true}
                  placeholder={{ label: 'Select Vehicle', value: null }} />
              </View>
              <View style={{
                flex: 0.1,
                justifyContent: 'center',
                // alignItems: 'flex-end'
              }}>
                <IconDown
                  name="caretdown"
                  color={Colors.borderColor}
                  onPress={() => {
                    togglePlatePicker.current.togglePicker()
                  }}
                />
              </View>
              <View style={{ flex: 0.6 }}>
                <TextInput maxLength={5} onChangeText={(value) => {
                  setPlateNumber(value)
                  setPlateColor(true)
                  setNumPlateValidation(false)
                }}
                  value={plateNumber.toUpperCase()}
                  placeholderTextColor="#707070" keyboardType="name-phone-pad" style={{ maxWidth: "70%", minWidth: '80%', color: '#707070' }} />
              </View>
            </View>
          }
          <TextInput maxLength={5} onChangeText={(value) => {
            setPlateNumber(value)
            setPlateColor(true)
            setNumPlateValidation(false)
          }}
            value={plateNumber.toUpperCase()}
            placeholderTextColor="#707070" keyboardType="name-phone-pad" style={{ maxWidth: "70%", minWidth: '80%', color: '#707070' }} />
        </View>
        <View style={{
          display: numPlateValidation ? 'flex' : 'none'
        }}>
          <Text style={{
            color: 'red'
          }}>License Plate Number is required</Text>
        </View>


        <View style={styles.inputContainer}>
          <Input maxLength={12} borderColor={makeColor ? Colors.borderColor : 'red'} onChangeText={(value) => {
            setMake(value)
            setMakeColor(true)
            setMakeValidation(false)
          }} label="Make*" />
          <View style={{
            display: makeValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Make is required</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Input maxLength={12} borderColor={modalColor ? Colors.borderColor : 'red'} onChangeText={(value) => {
            SetModal(value)
            setModalColor(true)
            setModelValidation(false)
          }} label="Model*" />
          <View style={{
            display: modelValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Model is required</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Input maxLength={4} borderColor={yearColor ? Colors.borderColor : 'red'} keyboardType={"numeric"} onChangeText={(value) => {
            setYear(value)
            setYearColor(true)
            setYearValidation(false)
          }} label="Year*" />
          <View style={{
            display: yearValidation ? 'flex' : 'none'
          }}>
            <Text maxLength={8} style={{
              color: 'red'
            }}>Year is required</Text>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: '#464951', paddingHorizontal: 5 }} >Color*</Text>
          <View style={styles.picker1}>
            {Platform.OS == 'android' ?
              <Picker
                style={styles.pickerText}
                mode="dialog"
                selectedValue={color}
                onValueChange={(value) => (setColor(value) && setColorValidation(false) && setColorColor(true))}
              >
                {carColors.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker> :
              <TouchableOpacity
                activeOpacity={0.1}
                onPress={
                  () => {
                    toggleColorPicker.current.togglePicker()
                  }
                }
                style={{
                  flexDirection: 'row'
                }}>
                <View style={{ flex: 0.5 }}>
                  <RNPickerSelect
                    ref={toggleColorPicker}
                    style={{
                      inputIOS: {
                        paddingVertical: 20,
                        paddingHorizontal: 10
                      }
                    }}
                    onValueChange={(value) => {
                      setColor(value) && setColorValidation(false) && setColorColor(true)
                    }}
                    items={carColors.map(item => (
                      { label: item, value: item }
                    ))}
                    useNativeAndroidPickerStyle={true}
                    placeholder={{ label: 'Select Color', value: null }}
                  />
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center' }}>
                  <IconDown
                    // onPress = {
                    //   // ()=>{toggleColorPicker.current.togglePicker()}
                    // }
                    style={{
                      alignSelf: 'flex-end',
                      paddingRight: 15,
                      zIndex: -99
                    }}
                    name="caretdown"
                    color={Colors.borderColor}
                  />
                </View>
              </TouchableOpacity>
            }

          </View>
          <View style={{
            display: colorValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Color is required</Text>
          </View>
        </View>
        {registerError ? <View>
          <Text style={{ color: "red" }} >Error in registering Vehicle</Text>
        </View> : null}
        <ActivityIndicator
          animating={loader}
          // style={{ marginVertical:  }}
          size={Platform.OS === 'android' ? 50 : 'large'}
          color={Colors.AppColor}
        />
        <View

          style={styles.inputContainer1}>
          {/* <View>
              <Button onPress={() => uploadPicture()} title="Upload Image" backgroundColor={Colors.AppColor} color="#FFFF" />
            </View> */}
          <View style={{ marginTop: 10 }} >
            <Button onPress={() => addVehicle()} title="Save" backgroundColor={Colors.AppColor} color="#FFFF" />
          </View>
        </View>
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFF',
    height: '100%',
  },
  vehicleRegisterText: {
    color: Colors.AppColor,
    fontFamily: bold,
    fontSize: 24,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  arrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 10,
  },
  arrow2: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 10
  },
  inputContainer: {
    marginTop: 5,
  },
  inputContainer1: {
    marginTop: 20,
    marginBottom: 20
  },
  headingText2: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  skip: {
    fontSize: 20,
    fontFamily: semiBold,
    color: '#464951',
  },
  picker1: {
    width: '100%',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignSelf: 'center',
    marginTop: 10
    // alignItems:'center'
  },
  pickerText: {
    color: '#707070',
    fontSize: 15,
  },
  picker2: {
    width: '30%',
    // flex:2,
    // borderColor: '#707070',
    // borderRadius: 10,
    backgroundColor: '#F8F8F8',
    // justifyContent: 'flex-start'
    // alignSelf: 'center',
    // marginTop: 10
    alignSelf: "flex-start"
  },
  vehicleSelection: {
    // marginVertical: 2,
    // width: '95%',
    alignSelf: 'center',
    // padding: 10,
    // justifyContent: 'space-between',
  },
  // vehicleDropDown: {
  //   flexDirection: 'row',
  //   // padding: 10,
  //   backgroundColor: '#F8F8F8',
  //   borderRadius: 10,
  //   height: 50,
  //   // flex:
  //   width: '20%',
  //   borderWidth: 1,
  //   borderColor: '#707070',
  // },
})
