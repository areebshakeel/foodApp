import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from 'rn-range-slider';

import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';

const SliderScreen = ({
  rangeDisabled,
  min,
  max,
  suffix,
  defaultLow,
  defaultHigh,
  // handleValueChange
}) => {
  // const [rangeDisabled, setRangeDisabled] = useState(false);
  const [low, setLow] = useState(defaultLow);
  const [high, setHigh] = useState(defaultHigh);
  // const [min, setMin] = useState(0);
  // const [max, setMax] = useState(100);
  const [floatingLabel, setFloatingLabel] = useState(false);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (value) => <Label text={value} suffix={suffix} />,
    [],
  );
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);



  return (
    <Slider
      style={styles.slider}
      min={min}
      max={max}
      step={1}
      low={low}
      high={high}
      disableRange={rangeDisabled}
      floatingLabel={floatingLabel}
      renderThumb={renderThumb}
      renderRail={renderRail}
      allowLabelOverflow={true}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      onValueChanged={handleValueChange}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
});

export default SliderScreen;
