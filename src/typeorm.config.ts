import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from '@dotenvx/dotenvx';
import { registerAs } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Mood } from './user/entities/mood.entity';
import { Initial1731149109126 } from '../migrations/1731149109126-initial';
import { AddPassword1736710185540 } from '../migrations/1736710185540-add_password';
import { ExpandPasswordLength1740937935656 } from '../migrations/1740937935656-expand_password_length';

dotenvConfig();

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  entities: [User, Mood],
  migrations: [
    Initial1731149109126,
    AddPassword1736710185540,
    ExpandPasswordLength1740937935656,
  ],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
