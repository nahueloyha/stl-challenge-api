import {db} from '../constant';
import {isEmptyOrNull} from '../types/type';
import {unifyAddresses} from './dbService';

export async function findNftByAddressAndTokenId(
  chainId: number,
  address: string,
  tokenId: string,
  verbose = false
) {
  try {
    const sql = verbose
      ? `select a.*, total_supply, b.metadata contract_metadata
        from nft_details a, token_metadata b
        where a.chain_id = $1 and a.token_address = $2 and a.token_id = $3 and a.chain_id = b.chain_id and a.token_address = b.address limit 1`
      : 'select * from nft_details where chain_id = $1 and token_address = $2 and token_id = $3 limit 1';
    const rows = await db.safeQuery(sql, [
      chainId,
      unifyAddresses(address),
      tokenId,
    ]);
    if (rows.length) {
      return {
        owner: rows[0]['owner'],
        tokenAddress: rows[0]['token_address'],
        tokenId: rows[0]['token_id'],
        tokenType: rows[0]['token_type'],
        symbol: rows[0]['symbol'],
        name: rows[0]['name'],
        balance: rows[0]['balance'],
        metadata: JSON.stringify(rows[0]['metadata']),
        totalSupply: rows[0]['total_supply'],
        contractMetadata: JSON.stringify(rows[0]['contract_metadata']),
      };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function findAllNftsByAddressAndContracts(
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
        ? `select a.*, total_supply, b.metadata contract_metadata
            from nft_details a, token_metadata b
            where a.chain_id = $3 ${sqlAndParameters.sql} and a.chain_id = b.chain_id and a.token_address = b.address`
        : `select * from nft_details where chain_id = $3 ${sqlAndParameters.sql}`) +
      result.orderSql;
    const rows = await db.safeQuery(sql, [
      ...result.pagingArgs,
      chainId,
      ...sqlAndParameters.parameters,
    ]);
    return rows.map(row => {
      return {
        owner: row['owner'],
        tokenAddress: row['token_address'],
        tokenId: row['token_id'],
        tokenType: row['token_type'],
        symbol: row['symbol'],
        name: row['name'],
        balance: row['balance'],
        metadata: JSON.stringify(row['metadata']),
        totalSupply: row['total_supply'],
        contractMetadata: JSON.stringify(row['contract_metadata']),
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
    return {sql: 'and owner = $4', parameters: [unifyAddresses(account)]};
  } else if (!nullAddress && !emptyContracts) {
    if (contracts!.length > 10) {
      throw new Error('the max length of contracts is 10.');
    }

    return {
      sql: 'and owner = $4 and token_address = any($5)',
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
