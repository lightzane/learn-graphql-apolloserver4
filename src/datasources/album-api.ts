import { RESTDataSource } from '@apollo/datasource-rest';

export class AlbumAPI extends RESTDataSource {
  baseURL = 'https://jsonplaceholder.typicode.com';

  getAlbums() {
    return this.get('albums');
  }
}
