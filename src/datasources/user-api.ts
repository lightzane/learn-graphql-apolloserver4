import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  baseURL = 'https://jsonplaceholder.typicode.com';

  getUsers() {
    return this.get('users');
  }
}
