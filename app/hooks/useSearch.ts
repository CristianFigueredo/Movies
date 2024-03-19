import {useEffect, useState} from 'react';
import OmdbService from '../services/omdb';
import {MediaResponse, OmdbFilter} from '../services/omdb.types';
import _debounce from 'lodash.debounce';
import {Alert} from 'react-native';

type Parameters = {
  query: string;
  filter: OmdbFilter;
  page: number;
  yearFilter?: number;
};

/*
 * This hook is responsible for handling the search logic and the state of the search screen.
 */
const useSearch = () => {
  const [searchResults, setResults] = useState<MediaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('Avengers');
  const [filter, setFilter] = useState<OmdbFilter>('all');
  const [yearFilter, setYearFilter] = useState(1900);
  const [page, setPage] = useState(1);

  const debouncedSetQuery = _debounce(text => {
    if (text === query || text.length < 3) {
      return;
    }
    setQuery(text);
    getNewResults(text);
  }, 1000);

  const search = async (params: Parameters) => {
    try {
      const searchResponse = await OmdbService.search(params);
      const response = await OmdbService.getByID(
        searchResponse.Search?.map(item => item.imdbID) || [],
      );

      setResults(previous =>
        Array.from(new Set([...previous, ...response.filter(isValidMedia)])),
      );

      setLoading(false);
    } catch (error) {
      Alert.alert(
        'Error',
        'Please check your internet connection or use a different ApiKey (because of the rate limits)',
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    search({query, filter, page, yearFilter});
  }, []);

  const getNextPage = () => {
    setPage(page + 1);
    search({query, filter, page: page + 1, yearFilter});
  };
  const getNewResults = (
    lastQuery?: string,
    lastFilter?: OmdbFilter,
    lastYearFilter?: number,
  ) => {
    setResults([]);
    setPage(1);
    setLoading(true);
    search({
      query: lastQuery || query,
      filter: lastFilter || filter,
      yearFilter: lastYearFilter || yearFilter,
      page: 1,
    });
  };

  return {
    results: searchResults,
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

const isValidMedia = (result: MediaResponse) => {
  return (
    result.Poster !== 'N/A' &&
    result.imdbRating !== 'N/A' &&
    result.Plot !== 'N/A'
  );
};

export default useSearch;
