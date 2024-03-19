import {useEffect, useState} from 'react';
import OmdbApiManager, {OmdbFilter} from '../services/omdb';
import {DetailsResponse} from '../services/omdb.types';
import _debounce from 'lodash.debounce';
import {Alert} from 'react-native';

interface SearchResults {
  totalResults: number;
  results: DetailsResponse[];
}

type Parameters = {
  query: string;
  filter: OmdbFilter;
  page: number;
  yearFilter?: number;
};

const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    totalResults: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState('Avengers');
  const [filter, setFilter] = useState<OmdbFilter>('all');
  const [yearFilter, setYearFilter] = useState<number>(1900);
  const [page, setPage] = useState(1);

  const debouncedSetQuery = _debounce(text => {
    if (text === query || text.length < 3) {
      return;
    }
    setQuery(text);
    getNewResults(text);
  }, 1000);

  const fetchSearchResults = async (params: Parameters) => {
    try {
      const searchResponse = await OmdbApiManager.search(
        params.query,
        params.filter,
        params.page,
        params.yearFilter,
      );

      const response = await OmdbApiManager.getByIDs(
        searchResponse.Search?.map(item => item.imdbID) || [],
      );
      setSearchResults(previous => ({
        totalResults: Number(searchResponse.totalResults),
        results: Array.from(
          new Set([...previous.results, ...response.filter(isValidResult)]),
        ),
      }));

      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Please check your internet connection or use a different ApiKey (because of the rate limits)',
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSearchResults({query, filter, page, yearFilter});
  }, []);

  const getNextPage = () => {
    setPage(page + 1);
    fetchSearchResults({query, filter, page: page + 1, yearFilter});
  };
  const getNewResults = (
    lastQuery?: string,
    lastFilter?: OmdbFilter,
    lastYearFilter?: number,
  ) => {
    setSearchResults({totalResults: 0, results: []});
    setPage(1);
    setLoading(true);
    fetchSearchResults({
      query: lastQuery || query,
      filter: lastFilter || filter,
      yearFilter: lastYearFilter || yearFilter,
      page: 1,
    });
  };

  return {
    results: searchResults.results,
    loading,
    filter,
    yearFilter,
    setQuery: debouncedSetQuery,
    setFilter,
    setYearFilter,
    getNextPage,
    getNewResults,
  };
};

const isValidResult = (result: DetailsResponse) => {
  return (
    result.Poster !== 'N/A' &&
    result.imdbRating !== 'N/A' &&
    result.Plot !== 'N/A'
  );
};

export default useSearch;
