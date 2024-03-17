import React, {FunctionComponent} from 'react';
import {ViewStyle} from 'react-native';
import {TextField, Card, Spacings, Colors} from 'react-native-ui-lib';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Spacer from './Spacer';

type Props = {
  onQueryChange?: (query: string) => void;
};
export const SearchBar: FunctionComponent<Props> = ({onQueryChange}) => {
  return (
    <Card containerStyle={$container}>
      <SimpleLineIcons style={$icon} name="magnifier" size={20} color="black" />
      <TextField
        placeholderTextColor={Colors.$textNeutral}
        placeholder="Search"
        hideUnderline
        onChangeText={onQueryChange}
        containerStyle={$textField}
      />
    </Card>
  );
};

const $container: ViewStyle = {
  padding: Spacings.s4,
  marginBottom: Spacings.s2,
  flexDirection: 'row',
};

const $textField: ViewStyle = {
  width: '100%',
};

const $icon: ViewStyle = {
  marginRight: Spacings.s4,
};
