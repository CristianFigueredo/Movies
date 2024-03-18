import {useEffect, useState} from 'react';
import OmdbApiManager, {OmdbFilter} from '../services/omdb';
import {DetailsResponse} from '../services/omdb.types';
import _debounce from 'lodash.debounce';

interface SearchResults {
  totalResults: number;
  results: DetailsResponse[];
}

type Parameters = {
  query: string;
  filter: OmdbFilter;
  page: number;
};

const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    totalResults: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [query, setQuery] = useState('Avengers');
  const [filter, setFilter] = useState<OmdbFilter>('all');
  const [page, setPage] = useState(1);

  const debouncedSetQuery = _debounce(text => {
    setQuery(text);
  }, 800);

  const fetchSearchResults = async (params: Parameters) => {
    setLoading(true);
    setError(false);

    try {
      const searchResponse = await OmdbApiManager.search(
        params.query,
        params.filter,
        params.page,
      );

      const response = await OmdbApiManager.getByIDs(
        searchResponse.Search.map(item => item.imdbID),
      );
      setSearchResults(previous => ({
        totalResults: Number(searchResponse.totalResults),
        results: Array.from(
          new Set([...previous.results, ...response.filter(isValidResult)]),
        ),
      }));
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults({query, filter, page});
  }, [query, filter, page]);

  useEffect(() => {
    setSearchResults({totalResults: 0, results: []});
    setPage(1);
    setLoading(true);
  }, [query, filter]);

  return {
    results: searchResults.results,
    loading,
    error,
    filter,
    setQuery: debouncedSetQuery,
    setFilter,
    setPage,
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
