import {IHttpClient} from './IHttpClient';

export class FetchHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from ${url}. Status: ${response.status}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }
}
