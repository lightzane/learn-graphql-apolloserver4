import { AlbumAPI } from './datasources/album-api';
import { UserAPI } from './datasources/user-api';

export type DataSourceContext = {
  dataSources: {
    userApi: UserAPI;
    albumApi: AlbumAPI;
  };
};
