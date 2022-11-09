import {ethers} from 'ethers';
import {Pool} from 'pg';
import {Logger} from 'pino';
import {LOGGER, pgOpts} from '../constant';

export class DBUtils {
  private readonly pool: Pool;
  private readonly DEFAULT_LIMIT = 100;
  private readonly DEFAULT_MAX = 1000;
  private logger: Logger;

  constructor() {
    this.pool = new Pool(pgOpts);
    this.logger = LOGGER.child({from: 'DbService'});
  }

  async safeQuery(sql: string, params: any[]) {
    try {
      return (await this.pool.query(sql, params)).rows;
    } catch (err: any) {
      this.logger.error(
        err,
        'executing sql: %s, args: %o, caused: %s',
        sql,
        params,
        err.message
      );
      return [];
    }
  }

  async safeUpdate(sql: string, params: any[]) {
    try {
      return await this.pool.query(sql, params);
    } catch (err: any) {
      this.logger.error(
        err,
        'executing sql: %s, args: %o, caused: %s',
        sql,
        params,
        err.message
      );
      return;
    }
  }

  prepareForOrderAndPagination(
    sortedColumns: string[],
    params: {
      sort?: string;
      order?: 'asc' | 'desc';
      max?: number;
      offset?: number;
    }
  ) {
    let orderSql = '';
    if (params.sort && sortedColumns.includes(params.sort)) {
      orderSql += ` order by ${params.sort}`;
      if (params.order && ['asc', 'desc'].includes(params.order)) {
        orderSql += ` ${params.order}`;
      }
    }
    orderSql += ' limit $1 offset $2';
    params.max = Math.min(params.max || this.DEFAULT_LIMIT, this.DEFAULT_MAX);
    params.offset = params.offset || 0;
    const pagingArgs = [params.max, params.offset];

    return {orderSql, pagingArgs};
  }

  prepareForSeekMethodPagination(
    sortedColumns: string[],
    params: {
      sort?: string;
      order?: 'asc' | 'desc';
      startAfter?: any;
      max?: number;
    }
  ) {
    let orderSql = '';
    const pagingArgs: any[] = [];
    if (
      params.startAfter &&
      params.sort &&
      sortedColumns.includes(params.sort)
    ) {
      if (params.order === 'desc') {
        // E.g SELECT * FROM t WHERE id < $1 ORDER BY id DESC FETCH FIRST 10 ROWS ONLY;
        orderSql += ` and ${params.sort} < $1`;
      } else {
        // E.g SELECT * FROM t WHERE id > $1 ORDER BY id FETCH FIRST 10 ROWS ONLY;
        orderSql += ` and ${params.sort} > $1`;
      }
      pagingArgs.push(params.startAfter);
    } else {
      // force keep pagingArgs length to 2 if startAfter non exists
      orderSql += ' and 1 = $1';
      pagingArgs.push(1);
    }
    if (params.sort && sortedColumns.includes(params.sort)) {
      orderSql += ` order by ${params.sort}`;
      if (params.order && ['asc', 'desc'].includes(params.order)) {
        orderSql += ` ${params.order}`;
      }
    }
    orderSql += ' fetch first $2 rows only';
    params.max = Math.min(params.max || this.DEFAULT_LIMIT, this.DEFAULT_MAX);
    pagingArgs.push(params.max);

    return {orderSql, pagingArgs};
  }

  async safeTx(queries: Array<{sql: string; params?: any[]}>) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const query of queries) {
        await client.query(query.sql, query.params);
      }
      await client.query('COMMIT');
    } catch (err: any) {
      await client.query('ROLLBACK');
      this.logger.error(
        err,
        'executing transactions error. queries: %o, caused: %s',
        queries,
        err.message
      );
    } finally {
      client.release();
    }
  }
}

export function unifyAddresses(address: string) {
  return ethers.utils.getAddress(address.toLocaleLowerCase());
}
