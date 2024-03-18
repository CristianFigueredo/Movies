import {DIContainer} from './http/DIContainer';
import {IHttpClient} from './http/IHttpClient';
import {DetailsResponse, SearchResponse} from './omdb.types';

export type OmdbFilter = 'movie' | 'series' | 'episode' | 'all';

class OmdbApiManager {
  private httpClient: IHttpClient;
  private baseURL = 'http://www.omdbapi.com';
  // TODO: this key should be stored in a secure place and provided by the user
  private apiKey = 'bfd8ec50'; //'3ff01e53';

  constructor() {
    this.httpClient = DIContainer.getHttpClient();
  }

  async search(
    query: string,
    type: OmdbFilter = 'all',
    page = 1,
  ): Promise<SearchResponse> {
    try {
      let url = `${this.baseURL}?apikey=${this.apiKey}&s=${encodeURIComponent(
        query,
      )}&page=${page}`;
      if (type !== 'all') {
        url += `&type=${type}`;
      }

      return await this.httpClient.get<SearchResponse>(url);
    } catch (error) {
      console.error('Error searching movie:', error);
      throw error;
    }
  }

  async getDetails(imdbID: string): Promise<DetailsResponse> {
    try {
      return await this.httpClient.get<DetailsResponse>(
        `${this.baseURL}/?apikey=${this.apiKey}&i=${imdbID}`,
      );
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  }
  async getByIDs(ids: string[]): Promise<DetailsResponse[]> {
    try {
      const promises = ids.map(id => this.getDetails(id));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error getting movies by IDs:', error);
      throw error;
    }
  }
}

export default new OmdbApiManager();
