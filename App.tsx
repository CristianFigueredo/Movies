import 'react-native-gesture-handler';
import {setupReactNativeUILibraryTheme} from './app/theme/setup';
setupReactNativeUILibraryTheme();
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MovieCard} from './app/components/MovieCard';
import {SearchBar} from './app/components/SearchBar';
import Spacer from './app/components/Spacer';
import {Button, Checkbox, Colors, Spacings, Text} from 'react-native-ui-lib';
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

function App(): React.JSX.Element {
  const [query, setQuery] = useState('Avengers');
  const [filter, setFilter] = useState<OmdbFilter>('all');
  const [page, setPage] = useState(1);

  const {searchResults} = useSearch({
    query,
    filter,
    page,
  });
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['35%'], []);

  // callbacks
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
          initialQuery={query}
          onQueryChange={setQuery}
          onFilterPress={handlePresentModalPress}
        />
        <Spacer height={Spacings.s3} />
        <FlashList<DetailsResponse>
          data={searchResults.results}
          contentContainerStyle={{paddingBottom: 100, paddingTop: 20}}
          renderItem={({item}) => (
            <MovieCard
              posterURL={item.Poster}
              title={item.Title}
              rating={parseFloat(item.imdbRating)}
              overview={item.Plot}
              index={0}
            />
          )}
          estimatedItemSize={200}
          onEndReached={() => setPage(previous => previous + 1)}
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
            <Text text60>Type of content</Text>
            <Spacer height={Spacings.s3} />
            <Checkbox style={$checkbox} label="All" value={true} />
            <Checkbox style={$checkbox} label="Movies" value={true} />
            <Checkbox style={$checkbox} label="Series" value={false} />
            <Checkbox style={$checkbox} label="Episodes" value={false} />
            <Spacer height={Spacings.s4} />
            <Button
              label="Apply"
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

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
