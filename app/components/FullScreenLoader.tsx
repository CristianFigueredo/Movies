import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Bounce} from 'react-native-animated-spinkit';
import {Colors} from 'react-native-ui-lib';

export const FullScreenLoader = () => {
  return (
    <View style={$fullScreenLoader}>
      <Bounce size={33} color={Colors.primary} />
    </View>
  );
};

const $fullScreenLoader: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};
