export type SearchResponseItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type MediaResponse = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {Source: string; Value: string}[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  Response: 'True' | 'False';
};

export type SearchResponse = {
  Search: SearchResponseItem[];
  totalResults: string;
  Response: 'True' | 'False';
};

export type OmdbFilter = 'movie' | 'series' | 'episode' | 'all';

export type SearchRequestParameters = {
  query: string;
  filter: OmdbFilter;
  page: number;
  yearFilter?: number;
};
