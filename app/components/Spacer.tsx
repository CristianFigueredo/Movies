import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Spacings } from 'react-native-ui-lib'

interface SpacerProps {
  height?: number
  width?: number
  style?: ViewStyle
}

const Spacer: React.FC<SpacerProps> = ({ height = Spacings.s2, width = Spacings.s2, style }) => {
  return <View style={[{ height, width }, style]} />;
};

export default Spacer;
