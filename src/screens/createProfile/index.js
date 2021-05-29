import React, {useState} from 'react';
import {View, Text, Image, TextInput} from 'react-native';
import PersonalInfo from './personalInfo';
import VehicleRegistration from './vehicleRegistration';
import MobileVerification from './mobileVerification';
export default function CreateProfile() {
  const [flag, setFlag] = useState(true);
  const [badge, setBadge] = useState(true);
  function flagFalse() {
    setFlag(false);
    alert('function Chalaa')
    // alert(flag)
  }

  function badgeFalse() {
    setBadge(false);
  }
  return (
    <View>
      {flag ? (
      <PersonalInfo />
        ) : !flag && badge ? (
          <VehicleRegistration badgeFalse={badgeFalse} />
          ) : !flag && !badge ? (
            <MobileVerification />
            ) : (
              <Text></Text>
      )}
    </View>
  );
}
