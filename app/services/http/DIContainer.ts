import {FetchHttpClient} from './FetchHttpClient';
import {IHttpClient} from './IHttpClient';

export class DIContainer {
  private static httpClient: IHttpClient;

  static getHttpClient(): IHttpClient {
    if (!DIContainer.httpClient) {
      DIContainer.httpClient = new FetchHttpClient();
    }
    return DIContainer.httpClient;
  }
}
