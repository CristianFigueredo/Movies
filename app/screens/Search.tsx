import React, {Fragment, useCallback, useRef} from 'react';
import {MediaCard} from '../components/MediaCard';
import {SearchBar} from '../components/SearchBar';
import Spacer from '../components/Spacer';
import {Colors, Spacings, View} from 'react-native-ui-lib';
import {Keyboard, ViewStyle} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import useSearch from '../hooks/useSearch';
import {MediaResponse} from '../services/omdb.types';
import {FlashList} from '@shopify/flash-list';
import {FullScreenLoader} from '../components/FullScreenLoader';
import {EmptyStateFeedback} from '../components/EmptyStateFeedback';
import {useNavigation} from '@react-navigation/native';
import {FiltersBottomSheet} from '../components/FiltersBottomSheet';

export function SearchScreen(): React.JSX.Element {
  const search = useSearch();
  const navigation = useNavigation();
  const filtersModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    filtersModalRef.current?.present();
  }, []);

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
          <FlashList<MediaResponse>
            data={search.results}
            contentContainerStyle={$mediaList}
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
          <FiltersBottomSheet
            ref={filtersModalRef}
            yearFilter={search.yearFilter}
            filter={search.filter}
            onApplyPress={(yearFilterCandidate, filterCandidate) => {
              let yearFilter: number | undefined = yearFilterCandidate;

              search.setYearFilter(yearFilter);
              if (filterCandidate) {
                search.setFilter(filterCandidate);
              }
              search.getNewResults(
                undefined,
                filterCandidate || undefined,
                yearFilter,
              );
              filtersModalRef.current?.dismiss();
            }}
          />
        </Fragment>
      )}
    </View>
  );
}

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
  backgroundColor: Colors.$backgroundNeutral,
};

const $mediaList: ViewStyle = {paddingBottom: 0, paddingTop: 20};
