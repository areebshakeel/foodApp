import React, { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker'
import { path } from '../../config/path'
import { Picker } from 'native-base'
import UAE from '../../images/uae.png'
import IconDown from 'react-native-vector-icons/AntDesign';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function EditVehicle({ navigation, route }) {
  const [plateNumber, setPlateNumber] = useState(route.params.data.plateNo)
  const [make, setMake] = useState(route.params.data.make)
  const [modal, SetModal] = useState(route.params.data.model)
  const [year, setYear] = useState(route.params.data.year)
  const [color, setColor] = useState(route.params.data.color)
  const [country, setCountry] = useState(route.params.data.country)
  const [photo, setPhoto] = useState(null)
  const [plateColor, setPlateColor] = useState(true)
  const [makeColor, setMakeColor] = useState(true)
  const [modalColor, setModalColor] = useState(true)
  const [yearColor, setYearColor] = useState(true)
  const [colorColor, setColorColor] = useState(true)
  const [numPlateValidation, setNumPlateValidation] = useState(false)
  const [makeValidation, setMakeValidation] = useState(false)
  const [modelValidation, setModelValidation] = useState(false)
  const [yearValidation, setYearValidation] = useState(false)
  const [colorValidation, setColorValidation] = useState(false)
  const [plateCode, setPlateCode] = useState(route.params.data.plateNo.substring(0, 3))
  const [loader, setLoader] = useState(false)
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

  useEffect(() => {
    let str = route.params.data.plateNo
    // let myCode = str.substring(0, 3)

    let plateNo = str.substring(3, str.length)
    setPlateNumber(plateNo)
    // console.log('My Plate-->> ', myCode)
  }, [])

  async function updateVehicle() {
    setLoader(true)
    if (plateNumber && make && modal && year && color && color !== "Select Color" && country) {
      try {
        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token)
        console.log(TokenValue)

        const form = new FormData()
        form.append('make', make)
        form.append('modal', modal)
        form.append('year', year)
        form.append('color', color)
        form.append('plateNo', plateCode + plateNumber)
        form.append('country', country)
        form.append('vid', route.params.data.id)

        await axios.post(path.UPDATE_VEHICLE_API, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          console.log('Res in Update vehicle-->> ', res.data.data);
          Toast.show({
            text: res.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
          setPlateColor(true)
          setMakeColor(true)
          setModalColor(true)
          setYearColor(true)
          setColorColor(true)
          setLoader(false)

          navigation.navigate('MyVehicles')
        }).catch((e) => {
          setLoader(false)

          console.log('error in vehicle update-->>  ', e.response.data)
        })
      } catch (error) {
        console.log('Error in Updating vehicle', error)
      }

    }
    else {
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
      // Alert.alert('Fill the required fields')
    }
  }

  return (
    <Container>
      <Content style={styles.container}>

        <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
          <Icon name="arrowleft" size={30} />
          <Text style={styles.skip}> </Text>
        </View>


        <View style={{ padding: 4, marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.vehicleRegisterText}>Update Vehicle</Text>
        </View>


        <View style={styles.imageContainer}>
          <Image resizeMode="contain" source={VehicleImage} />
        </View>

        <Text>License Plate Number*</Text>
        {/* <View style={{

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
          height: '5.5%',
          // flex:0.2,
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          marginTop: 20
        }}>

          <Image source={UAE} resizeMode="contain" style={{ width: '10%', }} />
          <Text style={{ color: "#707070", paddingHorizontal: 5 }}> Dubai</Text>
          <View style={styles.picker2}>
            <Picker

              style={styles.pickerText}
              mode="dialog"
              selectedValue={plateCode}
              onValueChange={(value) => (setPlateCode(value) && setColorValidation(false) && setColorColor(true))}
            >
              {numberPlate.map((item) => (
                <Picker.Item label={item} value={item} />
              ))}

            </Picker>
          </View>
          <TextInput maxLength={5}
           value={ plateNumber.toUpperCase()}
           onChangeText={( value) => {
            setPlateNumber(value)
            setPlateColor(true)
            setNumPlateValidation(false)
          }}
            placeholderTextColor="#707070" keyboardType="name-phone-pad" style={{ maxWidth: "70%", minWidth: '70%', color: '#707070' }} />
        </View> */}
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
          height: '5.5%',
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
                  ref = {togglePlatePicker}
                  // style={styles.inputAndroid}
                  value={plateCode}
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
                  onPress = {()=>{
                    togglePlatePicker.current.togglePicker()
                  }}
                />
              </View>
              <View style={{ flex: 0.6 }}>
                <TextInput maxLength={5} value={plateNumber} onChangeText={(value) => {
                  setPlateNumber(value)
                  setPlateColor(true)
                  setNumPlateValidation(false)
                }}
                  value={plateNumber.toUpperCase()}
                  placeholderTextColor="#707070" keyboardType="name-phone-pad" style={{ maxWidth: "70%", minWidth: '80%', color: '#707070' }} />
              </View>
              {/* <View style={{
      display: numPlateValidation ? 'flex' : 'none'
    }}>
      <Text style={{
        color: 'red'
      }}>License Plate Number required</Text>

    </View> */}

            </View>
          }

          {/* <View style={styles.vehicleDropDown}>
  <View style={{
    flex: 0.1,
    justifyContent: 'center'
  }}>
    <RNPickerSelect

      style={styles.inputAndroid}
      onValueChange={(value) => setPlateCode(value)}
      items={numberPlate.map(item => (
        { label: item }
      ))}
      useNativeAndroidPickerStyle={true}
      placeholder={{ label: 'Select Vehicle', value: null }} />
  </View>
  <View style={{
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }}>
    <IconDown
      name="caretdown"
      color={Colors.borderColor}
    />
  </View>
</View> */}

    {Platform.OS == 'android' &&
    <TextInput maxLength={5} onChangeText={(value) => {
      setPlateNumber(value)
      setPlateColor(true)
      setNumPlateValidation(false)
    }}
      value={plateNumber.toUpperCase()}
      placeholderTextColor="#707070" keyboardType="name-phone-pad" style={{ maxWidth: "70%", minWidth: '80%', color: '#707070' }} />
    }
        </View>
        <View style={{
          display: numPlateValidation ? 'flex' : 'none'
        }}>
          <Text style={{
            color: 'red'
          }}>License Plate Number required</Text>
        </View>


        <View style={styles.inputContainer}>
          <Input maxLength={12} borderColor={makeColor ? Colors.borderColor : 'red'} value={make} onChangeText={(value) => {
            setMake(value)
            setMakeColor(true)
            setMakeValidation(false)
          }} label="Make*" />
          <View style={{
            display: makeValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Make required</Text>
          </View>
        </View>
        <View maxLength={12} style={styles.inputContainer}>
          <Input borderColor={modalColor ? Colors.borderColor : 'red'} value={modal} onChangeText={(value) => {
            SetModal(value)
            setModalColor(true)
            setModelValidation(false)
          }} label="Model*" />
          <View style={{
            display: modelValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Model required</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Input maxLength={4} keyboardType={"numeric"} borderColor={yearColor ? Colors.borderColor : 'red'} value={year} onChangeText={(value) => {
            setYear(value)
            setYearColor(true)
            setYearValidation(false)
          }} label="Year*" />
          <View style={{
            display: yearValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Year required</Text>
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
                    value={color}
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
                    onPress={
                      () => { toggleColorPicker.current.togglePicker() }
                    }
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
            }}>Color required</Text>
          </View>
        </View>
        <ActivityIndicator
          animating={loader}
          // style={{ marginVertical:  }}
          size={Platform.OS === 'android' ? 50 : 'large'}
          color={Colors.AppColor}
        />
        <View
          style={styles.inputContainer1}>
          <View style={{ }} >
            <Button onPress={() => updateVehicle()} title="Update Vehicle" backgroundColor={Colors.AppColor} color="#FFFF" />
          </View>
        </View>


      </Content>
    </Container>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFF',
    // flex : 1
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
    color: '#3d3d3d',
    fontSize: 15,
  },
  pickerText: {
    color: '#707070',
    fontSize: 15,
  },
  picker2: {
    width: '30%',
    // flex:2,
    // borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    // justifyContent: 'flex-start'
    // alignSelf: 'center',
    // marginTop: 10
    alignSelf: "flex-start"
  },
});
