import {DIContainer} from './http/DIContainer';
import {IHttpClient} from './http/IHttpClient';
import {
  MediaResponse,
  SearchResponse,
  SearchRequestParameters,
} from './omdb.types';

class OmdbApiService {
  private httpClient: IHttpClient;
  private baseURL = 'https://www.omdbapi.com';
  // TODO: this key should be stored in a secure place and provided by the user
  private apiKey = 'bfd8ec50'; //'3ff01e53';

  constructor() {
    this.httpClient = DIContainer.getHttpClient();
  }

  async search(params: SearchRequestParameters): Promise<SearchResponse> {
    try {
      let url = `${this.baseURL}?apikey=${this.apiKey}&s=${encodeURIComponent(
        params.query,
      )}&page=${params.page}`;
      if (params.filter !== 'all') {
        url += `&type=${params.filter}`;
      }

      if (params.yearFilter && params.yearFilter > 1900) {
        url += `&y=${params.yearFilter}`;
      }

      return await this.httpClient.get<SearchResponse>(url);
    } catch (error) {
      console.error('Error searching movie:', error);
      throw error;
    }
  }

  async getDetails(mediaID: string): Promise<MediaResponse> {
    try {
      return await this.httpClient.get<MediaResponse>(
        `${this.baseURL}/?apikey=${this.apiKey}&i=${mediaID}`,
      );
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  }
  async getByID(ids: string[]): Promise<MediaResponse[]> {
    try {
      const promises = ids.map(id => this.getDetails(id));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error getting movies by IDs:', error);
      throw error;
    }
  }
}

export default new OmdbApiService();
