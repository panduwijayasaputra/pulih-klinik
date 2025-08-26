import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { environmentConfig } from './environment.config';
import { entities } from '../database';

const logger = new Logger('DatabaseConfig');

export const databaseConfig: MikroOrmModuleOptions = {
  driver: PostgreSqlDriver,
  host: environmentConfig.DB_HOST,
  port: environmentConfig.DB_PORT,
  user: environmentConfig.DB_USERNAME,
  password: environmentConfig.DB_PASSWORD,
  dbName: environmentConfig.DB_NAME,
  entities,
  debug: environmentConfig.NODE_ENV === 'development',
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './src/database/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
    allOrNothing: true,
    dropTables: false,
    safe: environmentConfig.NODE_ENV === 'production',
  },
  seeder: {
    path: './src/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 30000,
  },
  driverOptions: {
    connection: {
      ssl: environmentConfig.DB_SSL
        ? {
            rejectUnauthorized: false,
          }
        : false,
    },
  },
  connect: true,
  autoLoadEntities: true,
};
