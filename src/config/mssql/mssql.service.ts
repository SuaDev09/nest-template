import { Injectable } from '@nestjs/common';

// import * as SQL from 'mssql';
import { ConnectionPool } from 'mssql';
// Loggers
// import GeneralLogger from 'src/common/loggers/general-logger/general-logger';
import { CONFIG_DB } from './config.constant';
import GeneralLogger from 'src/common/loggers/general-logger/general-logger';

@Injectable()
export class MSSqlService {
  private pools: { [key: string]: Promise<ConnectionPool> } = {};

  async createPool() {
    for (const config of CONFIG_DB) {
      if (this.pools[config.poolName]) {
        GeneralLogger('DB', `Pool ${config.poolName} already exists.`, 'INFO');
        continue;
      }

      this.pools[config.poolName] = new ConnectionPool(config)
        .connect()
        .then((pool) => {
          GeneralLogger(
            'DB',
            `Connection Successful to ${config.poolName}`,
            'CONNECTION',
          );
          return pool;
        })
        .catch((e) => {
          const error = e.message ? e.message : e;
          GeneralLogger(
            'DB',
            `Error while connecting to DB ${config.poolName}: ${error}`,
            'ERROR',
          );
          throw new Error(
            `Pool ${config.poolName} cannot be created. ${error}`,
          );
        });
    }
  }

  async getPool(poolName: string): Promise<ConnectionPool> {
    const pool = this.pools[poolName];
    if (!pool) {
      await this.createPool();
      return this.pools[poolName];
    }
    return pool;
  }
}
