import React, {Fragment, useCallback, useMemo, useRef, useState} from 'react';
import {MediaCard} from '../components/MediaCard';
import {SearchBar} from '../components/SearchBar';
import Spacer from '../components/Spacer';
import {
  Button,
  Colors,
  RadioButton,
  RadioGroup,
  Slider,
  Spacings,
  Text,
  View,
} from 'react-native-ui-lib';
import {Keyboard, ViewStyle} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import useSearch from '../hooks/useSearch';
import {OmdbFilter} from '../services/omdb';
import {DetailsResponse} from '../services/omdb.types';
import {FlashList} from '@shopify/flash-list';
import {FullScreenLoader} from '../components/FullScreenLoader';
import {capitalize} from '../utils/strings';
import {EmptyStateFeedback} from '../components/EmptyStateFeedback';
import {useNavigation} from '@react-navigation/native';

export function SearchScreen(): React.JSX.Element {
  const filterCandidate = useRef<OmdbFilter | null>(null);
  const [yearFilterCandidate, setYearFilterCandidate] = useState(1900);

  const search = useSearch();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['41%'], []);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <View style={$container}>
      <Spacer height={Spacings.s5} />
      <SearchBar
        initialQuery="Avengers"
        onQueryChange={search.setQuery}
        onFilterPress={handlePresentModalPress}
      />
      {search.loading && search.results.length === 0 ? (
        <FullScreenLoader />
      ) : (
        <Fragment>
          <Spacer height={Spacings.s3} />
          <FlashList<DetailsResponse>
            data={search.results}
            contentContainerStyle={{paddingBottom: 0, paddingTop: 20}}
            renderItem={({item, index}) => (
              <MediaCard
                posterURL={item.Poster}
                title={item.Title}
                rating={parseFloat(item.imdbRating)}
                overview={item.Plot}
                index={index}
                onPress={() => {
                  // TODO: fix types
                  // @ts-ignore
                  navigation.navigate('Details', {media: item});
                }}
              />
            )}
            estimatedItemSize={200}
            onEndReachedThreshold={0.5}
            onEndReached={search.getNextPage}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <EmptyStateFeedback
                imageID="not_found"
                message="No results found"
              />
            }
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            bottomInset={Spacings.s3}
            backdropComponent={renderBackdrop}
            detached={true}
            style={$sheetContainer}
            snapPoints={snapPoints}>
            <BottomSheetView style={$bottomSheet}>
              <Text text60>Type of Media</Text>
              <Spacer height={Spacings.s3} />
              <RadioGroup
                initialValue={search.filter}
                onValueChange={(value: OmdbFilter) => {
                  filterCandidate.current = value;
                }}>
                {FILTERS.map(option => (
                  <RadioButton
                    key={option}
                    label={capitalize(option)}
                    value={option}
                    style={$checkbox}
                  />
                ))}
              </RadioGroup>
              <Spacer height={Spacings.s4} />
              <Text text60>
                Year (
                {yearFilterCandidate === 1900 ? 'All' : yearFilterCandidate})
              </Text>
              <Slider
                value={search.yearFilter}
                onValueChange={value => setYearFilterCandidate(value)}
                minimumValue={1900}
                maximumValue={2024}
                step={1}
              />
              <Spacer height={Spacings.s4} />
              <Button
                label="Apply"
                onPress={() => {
                  let yearFilter: number | undefined = yearFilterCandidate;

                  search.setYearFilter(yearFilter);
                  if (filterCandidate.current) {
                    search.setFilter(filterCandidate.current);
                  }
                  search.getNewResults(
                    undefined,
                    filterCandidate.current || undefined,
                    yearFilter,
                  );
                  filterCandidate.current = null;
                  bottomSheetModalRef.current?.dismiss();
                }}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </Fragment>
      )}
    </View>
  );
}

const FILTERS: OmdbFilter[] = ['all', 'movie', 'series'];

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
  backgroundColor: Colors.$backgroundNeutral,
};

const $bottomSheet: ViewStyle = {
  flex: 1,
  padding: Spacings.s4,
};

const $sheetContainer: ViewStyle = {
  marginHorizontal: Spacings.s3,
};

const $checkbox: ViewStyle = {
  marginBottom: Spacings.s1,
};
