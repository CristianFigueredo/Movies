import React, {FunctionComponent, Fragment, PropsWithChildren} from 'react';
import {
  ViewStyle,
  ImageStyle,
  TextStyle,
  Image,
  ImageBackground,
  Linking,
  FlatList,
  ScrollView,
} from 'react-native';
import {AppStackScreenProps} from '../navigators/AppNavigator';
import Icon from 'react-native-vector-icons/Octicons';
import {Text, Colors, Spacings, Chip, View} from 'react-native-ui-lib';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IMAGES} from '../../assets';
import truncate from 'lodash.truncate';
import {DetailsResponse} from '../services/omdb.types';

interface Props extends AppStackScreenProps<'Details'> {}

export const DetailsScreen: FunctionComponent<Props> = function () {
  const route = useRoute();
  const {media} = route.params as {media: DetailsResponse};
  const navigation = useNavigation();

  if (!media) {
    return null;
  }

  return (
    <ScrollView style={$root}>
      <ImageBackground
        style={$movieBackdrop}
        defaultSource={IMAGES.MOVIE_BACKDROP_PLACEHOLDER}
        source={{
          uri: media.Poster,
        }}
        blurRadius={3}>
        <IconWrapper
          onPress={navigation.goBack}
          size="small"
          style={$closeIconWrapper}>
          <Icon size={25} color="white" name="x" />
        </IconWrapper>
        <IconWrapper size="small" onPress={() => showTrailers(media.Title)}>
          <Icon name="play" size={25} color="white" />
        </IconWrapper>
      </ImageBackground>
      <View style={$contentContainer}>
        <View style={$directionRow}>
          <Image
            style={$poster}
            defaultSource={IMAGES.GENERIC_IMAGE_PLACEHOLDER}
            source={{
              uri: media.Poster,
            }}
          />
          <View style={$titleAndDetailsContainer}>
            <Text text70M marginB-s3 numberOfLines={3}>
              {media.Title} ({media.Director})
            </Text>
            <View style={$genres}>
              {media.Genre.split(', ').map((genre, index) => (
                <Chip
                  size={20}
                  marginB-s1
                  marginR-s2
                  key={genre + index}
                  label={genre}
                />
              ))}
              <Chip marginR-s2 size={20} marginB-s1 label={media.imdbRating} />
              <Chip marginR-s2 size={20} marginB-s1 label={media.Year} />
              <Chip marginR-s2 size={20} marginB-s1 label={media.Type} />
            </View>
            <Text text80 marginT-s2>
              {media.Runtime}
            </Text>
          </View>
        </View>
        <Text text60M marginB-s2>
          Introduction
        </Text>
        <Text>{media.Plot}</Text>
        {!!media.Actors.split(', ').length && (
          <Fragment>
            <Text text60M marginT-s6 marginB-s3>
              Cast
            </Text>
            <FlatList
              data={media.Actors.split(', ').map(name => name)}
              horizontal
              contentContainerStyle={{width: '100%'}}
              keyExtractor={(item, index) => item + index}
              renderItem={({item: actorName}) => (
                <View marginR-s6>
                  <View style={$castPicture} />
                  <Text style={$castName} marginT-s1>
                    {truncate(actorName, {length: 13})}
                  </Text>
                </View>
              )}
            />
          </Fragment>
        )}
      </View>
    </ScrollView>
  );
};

const showTrailers = (query: string) => {
  const url =
    'https://www.youtube.com/results?search_query=' +
    encodeURIComponent(query + ' trailer');
  console.log(url);
  Linking.openURL(url);
};

const iconWrapperSizes: Record<string, ViewStyle> = {
  big: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  small: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
};

type IconWrapperSize = keyof typeof iconWrapperSizes;

type IconWrapperProps = PropsWithChildren<{
  size?: IconWrapperSize;
  style?: ViewStyle;
  onPress?: () => void;
}>;
const IconWrapper: FunctionComponent<IconWrapperProps> = ({
  children,
  size = 'big',
  style,
  onPress,
}) => (
  <View
    onTouchEnd={onPress}
    style={[$iconWrapper, iconWrapperSizes[size], style]}>
    {children}
  </View>
);

const $iconWrapper: ViewStyle = {
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
};
const $root: ViewStyle = {
  flex: 1,
  zIndex: 1,
};

const $movieBackdrop: ViewStyle = {
  width: '100%',
  height: 300,
  justifyContent: 'center',
  alignItems: 'center',
};

const $contentContainer: ViewStyle = {
  borderRadius: 20,
  top: -35,
  padding: Spacings.s6,
  backgroundColor: Colors.$backgroundNeutral,
};

const $directionRow: ViewStyle = {
  flexDirection: 'row',
};

const $poster: ImageStyle = {
  width: 170,
  height: 250,
  borderRadius: 10,
  top: -75,
};

const $castPicture: ImageStyle = {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 40,
  backgroundColor: Colors.$backgroundNeutralIdle,
  opacity: 0.3,
};

const $castName: TextStyle = {
  textAlign: 'center',
  fontSize: 12,
};

const $genres: ViewStyle = {
  maxWidth: 200,
  flexDirection: 'row',
  flexWrap: 'wrap',
};
const $titleAndDetailsContainer: ViewStyle = {
  marginLeft: Spacings.s4,
  marginTop: Spacings.s4,
  maxWidth: 200,
};

const $closeIconWrapper: ViewStyle = {
  position: 'absolute',
  top: 50,
  left: 20,
  zIndex: 2,
};
