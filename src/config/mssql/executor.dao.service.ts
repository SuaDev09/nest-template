import { Injectable } from '@nestjs/common';
import {
  ConnectionPool,
  Transaction,
  Request,
  IProcedureResult,
  IResult,
} from 'mssql';
import { MSSqlService } from './mssql.service';

@Injectable()
export class DAOExecutor {
  constructor(private readonly _msSqlService: MSSqlService) {}

  async _getPool(poolName: string): Promise<ConnectionPool> {
    const POOL = await this._msSqlService.getPool(poolName);
    if (!POOL) throw new Error('POOL not found');
    return POOL;
  }

  async _executeQuery(
    poolName: string,
    description: string,
    queryFunction: (...args: any[]) => string,
    ...args: any[]
  ): Promise<IResult<any>> {
    try {
      const POOL = await this._getPool(poolName);
      const result = await POOL.request().query(queryFunction(...args));
      return result;
    } catch (error) {
      console.log(`Error executing query: ${description}`, error);
      throw new Error(error);
    }
  }

  async _executeStoredProcedure(
    poolName: string,
    procedureName: string,
    inputs: Record<string, any>,
  ): Promise<IProcedureResult<any>> {
    try {
      const POOL = await this._getPool(poolName);
      let request = POOL.request();
      for (const key in inputs) {
        const input = inputs[key];
        if (input && input.type && input.direction === 'output') {
          request = request.output(key, input.type, input.value);
        } else {
          // Si el valor es null o undefined, igual se manda como input
          request = request.input(key, input);
        }
      }
      return await request.execute(procedureName);
    } catch (error) {
      console.log(`Error executing stored procedure: ${procedureName}`, error);
      throw new Error(error);
    }
  }

  async _executeTransaction(
    poolName: string,
    procedureName: string,
    inputsList: Array<Record<string, any>>,
  ): Promise<void> {
    const POOL = await this._getPool(poolName);
    const transaction = new Transaction(POOL);

    try {
      await transaction.begin();

      for (const inputs of inputsList) {
        const request = new Request(transaction);
        for (const key in inputs) {
          request.input(key, inputs[key]);
        }
        await request.execute(procedureName);
      }

      await transaction.commit();
    } catch (error) {
      console.log(
        `Error executing stored procedure in transaction: ${procedureName}`,
        error,
      );
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.log(
          `Error rolling back transaction: ${procedureName}`,
          rollbackError,
        );
        throw rollbackError;
      }
      throw error;
    }
  }
}
