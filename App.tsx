import 'react-native-gesture-handler';
import {setupReactNativeUILibraryTheme} from './app/theme/setup';
setupReactNativeUILibraryTheme();
import React, {Fragment, useCallback, useMemo, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MediaCard} from './app/components/MediaCard';
import {SearchBar} from './app/components/SearchBar';
import Spacer from './app/components/Spacer';
import {
  Button,
  Colors,
  RadioButton,
  RadioGroup,
  Spacings,
  Text,
} from 'react-native-ui-lib';
import {Keyboard, ViewStyle} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import useSearch from './app/hooks/useSearch';
import {OmdbFilter} from './app/services/omdb';
import {DetailsResponse} from './app/services/omdb.types';
import {FlashList} from '@shopify/flash-list';
import {FullScreenLoader} from './app/components/FullScreenLoader';
import {capitalize} from './app/utils/strings';
import {EmptyStateFeedback} from './app/components/EmptyStateFeedback';

function App(): React.JSX.Element {
  const filterCandidate = useRef<OmdbFilter>(null);

  const search = useSearch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['32%'], []);

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
    <GestureHandlerRootView style={$container}>
      <BottomSheetModalProvider>
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
                <Button
                  label="Apply"
                  onPress={() => {
                    if (filterCandidate.current) {
                      search.setFilter(filterCandidate.current);
                      search.getNewResults(undefined, filterCandidate.current);
                      filterCandidate.current = null;
                    }
                    bottomSheetModalRef.current?.dismiss();
                  }}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </Fragment>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
export default App;
