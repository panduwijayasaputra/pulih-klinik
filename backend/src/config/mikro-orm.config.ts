import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { environmentConfig } from './environment.config';
import { entities } from '../database';

export default defineConfig({
  host: environmentConfig.DB_HOST,
  port: environmentConfig.DB_PORT,
  user: environmentConfig.DB_USERNAME,
  password: environmentConfig.DB_PASSWORD,
  dbName: environmentConfig.DB_NAME,
  entities,
  debug: environmentConfig.NODE_ENV === 'development',
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './dist/database/migrations',
    tableName: 'migrations',
    transactional: true,
  },
  seeder: {
    path: './dist/database/seeders',
  },
  driverOptions: {
    connection: {
      ssl: false,
    },
  },
});
