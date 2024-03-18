import {useEffect, useState} from 'react';
import OmdbApiManager, {MovieType} from '../services/omdb';

interface Movie {
  // Define your movie interface
}

interface SearchResults {
  totalResults: number;
  movies: Movie[];
}

type Parameters = {
  query: string;
  filter: MovieType;
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
    movies: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchSearchResults = async (params: Parameters) => {
    setLoading(true);
    setError(false);

    try {
      const response = await OmdbApiManager.search(
        params.query,
        params.filter,
        params.page,
      );
      console.log({
        response,
      });
      setSearchResults({
        totalResults: response.totalResults,
        movies: response.Search,
      });
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
