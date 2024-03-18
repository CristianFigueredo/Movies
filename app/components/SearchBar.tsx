import React, {FunctionComponent} from 'react';
import {Pressable, ViewStyle} from 'react-native';
import {TextField, Card, Spacings, Colors} from 'react-native-ui-lib';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

type Props = {
  onQueryChange?: (query: string) => void;
  onFilterPress?: () => void;
  initialQuery?: string;
};
export const SearchBar: FunctionComponent<Props> = ({
  onQueryChange,
  onFilterPress,
  initialQuery,
}) => {
  return (
    <Card containerStyle={$container}>
      <SimpleLineIcons style={$icon} name="magnifier" size={18} color="black" />
      <TextField
        placeholderTextColor={Colors.$textNeutral}
        placeholder="Search"
        hideUnderline
        value={initialQuery}
        onChangeText={onQueryChange}
        containerStyle={$textField}
      />
      <Pressable onPress={onFilterPress}>
        <IonIcons
          style={$icon}
          name="filter-outline"
          size={18}
          color={'black'}
        />
      </Pressable>
    </Card>
  );
};

const $container: ViewStyle = {
  padding: Spacings.s4,
  marginBottom: Spacings.s2,
  flexDirection: 'row',
  alignItems: 'center',
  height: 50,
};

const $textField: ViewStyle = {
  width: '83%',
};

const $icon: ViewStyle = {
  marginRight: Spacings.s4,
};
