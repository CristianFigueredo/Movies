import {useEffect, useState} from 'react';
import OmdbApiManager, {OmdbFilter} from '../services/omdb';
import {DetailsResponse} from '../services/omdb.types';

interface SearchResults {
  totalResults: number;
  results: DetailsResponse[];
}

type Parameters = {
  query: string;
  filter: OmdbFilter;
  page: number;
};

const useSearch = ({
  query,
  filter,
  page,
}: Parameters): {
  searchResults: SearchResults;
  loading: boolean;
  error: boolean;
} => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    totalResults: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
        results: Array.from(new Set([...previous.results, ...response])),
      }));
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults({query, filter, page});
  }, [query, filter, page]);

  return {searchResults, loading, error};
};

export default useSearch;
