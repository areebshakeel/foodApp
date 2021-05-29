import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    Alert,
    Animated,
    ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MobileVerifyImage from '../../images/Authentication-bro.png';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../Components/Button/index'
import Colors from '../../config/colors';
import { Content, Container, Picker } from 'native-base';
import axios from 'axios';
import { path } from '../../config/path';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import CountryPicker from 'react-native-country-picker-modal'
import UAE from '../../images/uae.png'



const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function MobileVerification({ navigation, route }) {
    const [code, setCode] = useState('+971')
    const [number, setNumber] = useState('')
    const [otpInputs, setOtpInputs] = useState(false)
    const [loader, setLoader] = useState(false)
    const [myCode, setMycode] = useState('')
    const [timer, setTimer] = useState(0)
    const [resendOtp, setResendOtp] = useState(true)
    const [generateOtp, setGenerateOtp] = useState(true)
    const [isPlaying, setIsplaying] = useState(true)
    const [numberTakenValidation, setNumberTakenValidation] = useState(false)
    const [validationNumberError, setValidationNumberError] = useState('')
    const [readOnly, setReadOnly] = useState(true)
    const [otpIncorrect, setOtpErrors] = useState('')
    // console.log('codes-->> ', code)
    const mobile = code.concat(number)
    console.log('number-->>', mobile)
    const countryCodes = [

        {
            "name": "Viet Nam",
            "dial_code": "+92",
            "code": "VN"
        },

    ]
    useEffect(() => {
        setTimer(30)
    }, [])

    async function sendOtp() {
        setReadOnly(false)
        setValidationNumberError(false)
        if (number) {
            setNumberTakenValidation(false)
            setGenerateOtp(false)
            setResendOtp(false)
            console.log('mobile--->> ', mobile)
            setLoader(true)
            const formData = new FormData()
            formData.append('mobile', mobile)
            formData.append('type', 'Forget Password')
            await axios.post(path.SEND_OTP, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }).then((res) => {
                setReadOnly(false)
                setIsplaying(true)
                setOtpInputs(true)
                setLoader(false)
                setGenerateOtp(false)
                setResendOtp(false)
                setTimeout(() => {
                    setOtpInputs(false)
                    setResendOtp(true)
                }, 30000)
                setTimer(30)
                console.log('Res in send OTP', res);
                // Alert.alert('Please Input the OTP!')
            }).catch((e) => {
                setReadOnly(true)
                setLoader(false)
                setGenerateOtp(true)
                console.log('error in Forgot-->>', e.response.data.data)
            })
        } else { setNumberTakenValidation(true) }

    }
    // 03182122206
    async function verifyOtp(code) {
        setOtpInputs(false)
        setLoader(true)
        setReadOnly(false)
        const formData = new FormData()
        console.log('OTPPPPP->>> ', code)
        formData.append('otp', code)
        formData.append('mobile', mobile)
        formData.append('type', 'Forget Password')

        await axios.post(path.VERIFY_OTP, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
        }).then(async (res) => {
            setLoader(false)
            setTimer(30)
            setReadOnly(false)
            // Alert.alert(" OTP Verification ", '  SUCCESSFULL   ')
            navigation.navigate('ResetPassword', { 'mobile': mobile })

        }).catch((e) => {
            setLoader(false)
            setGenerateOtp(true)
            setReadOnly(false)
            let myError = JSON.stringify(e.response.data.data.Message)

            // alert(myError.substr(1, myError.length - 2))
            setNumberTakenValidation(true)
            setValidationNumberError(myError.substr(1, myError.length - 3))
            console.log('Otp Forget-->> ', myError)
            console.log('Otp Validate-->> ', validationNumberError)

            // Alert.alert('error in OTP verification ')
        })
    }
    return (
        <Container>
            <Content style={styles.container}>
                <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
                    <Icon name="arrowleft" size={30} />
                    <Text style={styles.skip}> </Text>
                </View>
                <View style={styles.headingContainer}>
                    <Text style={styles.mobileVerifyHeading}>Forget Password</Text>
                    <Text style={styles.verifyDescription}>
                        A verification will be sent {'\n'} to your mobile phone.
          </Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={MobileVerifyImage} resizeMode="contain" width />
                </View>

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
                    borderColor: "#707070", height: '8%', width: '83%',
                    backgroundColor: '#F8F8F8',
                    borderRadius: 8,
                    marginTop: 20
                }} >

                    <Image source={UAE} resizeMode="contain" style={{ width: '10%' }} />
                    {/* <Icon style={{ paddingHorizontal: 10 }} name="caretdown" color="#707070" /> */}
                    <Text style={{ color: "#707070", paddingHorizontal: 5 }}> +971</Text>

                    <TextInput editable={readOnly} maxLength={9} onChangeText={(value) => setNumber(value)}
                        placeholderTextColor="#707070" keyboardType="number-pad" style={{ maxWidth: "70%", minWidth: '80%', color: "#707070" }} />
                </View>
                <ActivityIndicator
                    animating={loader}
                    style={{ position: 'absolute', alignSelf: 'center', marginTop: '80%' }}
                    size={Platform.OS === 'android' ? 50 : 'large'}
                    color={Colors.AppColor}
                />
                <View style={{
                    display: numberTakenValidation ? 'flex' : 'none',
                    marginLeft: 35,
                    marginTop: 20
                }}>
                    <Text style={{
                        color: 'red'
                    }}>{validationNumberError ? validationNumberError : "Cannot leave number empty"}</Text>
                </View>
                {otpInputs ? <View style={styles.otpContainer}>
                    <Text style={styles.otpHeading}>OTP Verification</Text>
                    <View style={{ width: '70%', alignSelf: 'center' }} >
                        <Text style={styles.otpDescription}>
                            A verification code has been sent to your Mobile Number
          </Text>
                    </View>
                    <View >
                        <View style={{ alignItems: 'center' }} >
                            <CountdownCircleTimer
                                size={70}
                                strokeWidth={2}
                                isPlaying={isPlaying}
                                duration={timer}
                                colors={[
                                    ['#004777', 0.4],
                                    ['#F7B801', 0.4],
                                    ['#2196F3', 0.2],
                                ]}
                            >{({ remainingTime, animatedColor }) => (
                                <Animated.Text style={{ color: '#2196F3' }}>
                                    {remainingTime}
                                </Animated.Text>
                            )}
                            </CountdownCircleTimer>
                        </View>
                        <OTPInputView
                            style={{ width: '80%', alignSelf: 'center', height: 100 }}
                            pinCount={4}
                            autoFocusOnLoad={true}
                            onCodeChanged={() => setIsplaying(false)}
                            onCodeFilled={(code) => verifyOtp(code)}
                            codeInputFieldStyle={styles.otpStyle}
                            codeInputHighlightStyle={styles.otpText}

                        />
                    </View>

                </View>
                    : <Text> </Text>}



                {generateOtp ?
                    <View style={{ paddingHorizontal: 30, marginTop: 10 }} >

                        <Button
                            onPress={() => sendOtp()}
                            title="Generate OTP" backgroundColor={Colors.AppColor} color="#FFFF" />

                    </View>
                    : (resendOtp ?
                        <View style={{ paddingHorizontal: 30, marginTop: 10 }} >

                            <Button
                                onPress={() => sendOtp()}
                                title="Resend OTP" backgroundColor={Colors.AppColor} color="#FFFF" />

                        </View> : null
                    )}

            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#FFFF',
        flex: 1
    },
    imageContainer: {
        alignSelf: 'center',
        alignItems: 'center'
    },
    countryStyle: {
        borderColor: 'black',
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    mobileVerifyHeading: {
        color: Colors.AppColor,
        fontSize: 24,
        fontFamily: bold,
        fontWeight: 'bold',
    },
    headingContainer: {
        alignSelf: 'flex-start',
        padding: 20,
        marginTop: 20,
    },
    verifyDescription: {
        color: '#3D3D3D',
        // fontWeight:'Semibold',
        width: 240,
        fontSize: 15,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#707070',
        borderRadius: 8,
        backgroundColor: '#F8F8F8',
        // flexDirection: 'row',
        // justifyContent: 'space-evenly'
        // flex:1,

    },
    allInputsContainer: {
        // alignSelf: 'center',
        paddingHorizontal: 25
    },
    otpStyle: {
        borderColor: '#707070',
        borderRadius: 8,
        color: 'black',
        fontWeight: 'bold'
    },
    otpText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 20
    },

    inputs: {
        // maxWidth: "70%",
        // minWidth: "67%",
    },
    label: {
        color: '#9A9A9A',
        fontWeight: 'bold',
    },
    otpHeading: {
        color: Colors.AppColor,
        fontSize: 24,
        fontFamily: bold,
        textAlign: 'center',
    },
    otpContainer: {
        marginTop: 10,
        alignSelf: 'center',
    },
    otpDescription: {
        textAlign: 'center',
        fontSize: 15,
        color: '#3D3D3D',
        fontFamily: regular
    },
    otpInput: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#3D3D3D',
        width: 50,
        borderRadius: 8,
        paddingVertical: 10,
        textAlign: 'center',

        // margin:2,
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // paddingHorizontal: 20,
    },
    nextButton: {
        backgroundColor: Colors.AppColor,
        paddingVertical: 15,
        paddingHorizontal: 130,
        borderRadius: 8,
        marginTop: 6,
    },

    arrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },

    picker: {
        width: '100%',
        flex: 0.2,

    }
});
