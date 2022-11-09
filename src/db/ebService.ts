import {db} from '../constant';
import {isEmptyOrNull} from '../types/type';
import {unifyAddresses} from './dbService';

export async function findErc20Balance(
  chainId: number,
  address: string,
  tokenAddress: string,
  verbose = false
) {
  try {
    const sql = verbose
      ? `select a.*,
           (select total_supply from token_metadata where chain_id = a.chain_id and address = a.token_address limit 1)
         from erc20balance a where chain_id = $1 and address = $2 and token_address = $3 limit 1`
      : 'select * from erc20balance where chain_id = $1 and address = $2 and token_address = $3 limit 1';
    const rows = await db.safeQuery(sql, [
      chainId,
      unifyAddresses(address),
      unifyAddresses(tokenAddress),
    ]);

    if (rows.length) {
      return {
        account: rows[0]['address'],
        tokenAddress: rows[0]['token_address'],
        symbol: rows[0]['symbol'],
        name: rows[0]['name'],
        decimals: rows[0]['decimals'],
        balance: rows[0]['balance'],
        chainId: rows[0]['chain_id'],
        totalSupply: rows[0]['total_supply'],
        balanceRaw: rows[0]['balance_raw'],
      };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function findAllErc20BalancesByAddressAndContracts(
  chainId: number,
  address: string | null,
  contracts: string[] | null,
  options: {
    sort: string;
    max?: number;
    startAfter?: any;
    order?: 'asc' | 'desc';
  },
  verbose = false
) {
  const sqlAndParameters = buildSqlAndParameters(address, contracts);
  try {
    const result = db.prepareForSeekMethodPagination(['id'], options);
    const sql =
      (verbose
        ? `select a.*,
            (select total_supply from token_metadata where chain_id = a.chain_id and address = a.token_address limit 1)
        from erc20balance a where chain_id = $3 ${sqlAndParameters.sql}`
        : `select * from erc20balance where chain_id = $3 ${sqlAndParameters.sql}`) +
      result.orderSql;
    const rows = await db.safeQuery(sql, [
      ...result.pagingArgs,
      chainId,
      ...sqlAndParameters.parameters,
    ]);
    return rows.map(row => {
      return {
        account: row['address'],
        tokenAddress: row['token_address'],
        symbol: row['symbol'],
        name: row['name'],
        decimals: row['decimals'],
        balance: row['balance'],
        chainId: row['chain_id'],
        totalSupply: row['total_supply'],
        balanceRaw: row['balance_raw'],
      };
    });
  } catch (err) {
    return [];
  }
}

function buildSqlAndParameters(
  account: string | null,
  contracts: string[] | null
) {
  const nullAddress = !account;
  const emptyContracts = isEmptyOrNull(contracts);

  if (nullAddress && emptyContracts) {
    throw new Error('account and contracts cannot be null or empty both.');
  } else if (!nullAddress && emptyContracts) {
    return {sql: 'and address = $4', parameters: [unifyAddresses(account)]};
  } else if (!nullAddress && !emptyContracts) {
    if (contracts!.length > 10) {
      throw new Error('the max length of contracts is 10.');
    }

    return {
      sql: 'and address = $4 and token_address = any($5)',
      parameters: [
        unifyAddresses(account),
        contracts!.map(contract => {
          return unifyAddresses(contract);
        }),
      ],
    };
  } else {
    if (contracts!.length > 10) {
      throw new Error('the max length of contracts is 10.');
    }

    return {
      sql: 'and token_address = any($4)',
      parameters: [
        contracts!.map(contract => {
          return unifyAddresses(contract);
        }),
      ],
    };
  }
}
