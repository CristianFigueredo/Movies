import React, {FunctionComponent} from 'react';
import {ViewStyle, ImageStyle, TextStyle, StyleProp} from 'react-native';
import {Card, Text, View, Spacings, Colors} from 'react-native-ui-lib';
import FastImage from 'react-native-fast-image';
import truncate from 'lodash.truncate';

type Props = {
  posterURL: string;
  title: string;
  voteAverage: number;
  overview: string;
  onPress?: () => void;
  index: number;
};

export const MovieCard: FunctionComponent<Props> = ({
  posterURL,
  title,
  voteAverage,
  overview,
  onPress,
  index,
}) => {
  return (
    <Card onPress={onPress} key={1} style={$container}>
      <FastImage
        source={{
          uri: posterURL.replace('original', 'w342'),
          priority:
            index < 3 ? FastImage.priority.high : FastImage.priority.low,
        }}
        placeholderContentFit="cover"
        // @ts-expect-error FastImage style prop is not typed correctly
        style={$posterImage}
      />
      <View style={$middleContainer}>
        <Text style={$titleLabel} text50M>
          {truncate(title, {length: 25})}
        </Text>
        <Text style={$overview}>{overview?.slice(0, 90)}...</Text>
      </View>

      <Text style={$voteAverageLabel}>{voteAverage.toFixed(1)}</Text>
    </Card>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: 168,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: Spacings.s6,
  overflow: 'visible',
  marginBottom: Spacings.s8,
};
const $posterImage: StyleProp<ImageStyle> = {
  width: 110,
  height: 170,
  borderRadius: 10,
  top: -Spacings.s10 * 1.1,
};

const $voteAverageLabel: TextStyle = {
  color: Colors.$textPrimary,
  fontWeight: '800',
  fontSize: 20,
};

const $titleLabel: TextStyle = {
  color: Colors.$textPrimary,
  marginBottom: Spacings.s1,
  textAlign: 'center',
};

const $overview: TextStyle = {
  fontWeight: '400',
  fontSize: 12,
  color: Colors.$textNeutral,
  textAlign: 'center',
  marginTop: Spacings.s1,
};

const $middleContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: Spacings.s3,
};
