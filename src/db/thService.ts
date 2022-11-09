import {db} from '../constant';
import {unifyAddresses} from './dbService';

export async function findAllTokenHistories(
  chainId: number,
  from: string | null,
  to: string | null,
  contract: string | null,
  begin: string | null,
  end: string | null,
  options: {
    sort: string;
    max?: number;
    startAfter?: any;
    order?: 'asc' | 'desc';
  }
) {
  const sqlAndParameters = buildSqlAndParameters(
    from,
    to,
    contract,
    begin,
    end
  );

  try {
    const result = db.prepareForSeekMethodPagination(['id'], options);
    const sql =
      `select * from token_history where chain_id = $3 ${sqlAndParameters.sql}` +
      result.orderSql;
    const rows = await db.safeQuery(sql, [
      ...result.pagingArgs,
      chainId,
      ...sqlAndParameters.parameters,
    ]);
    return rows.map(row => {
      return {
        from: row['from_address'],
        to: row['to_address'],
        tokenAddress: row['token_address'],
        tokenType: row['token_type'],
        txHash: row['tx_hash'],
        event: row['event_name'],
        details: JSON.stringify(row['details']),
        timestamp: row['timestamp'],
      };
    });
  } catch (err) {
    return [];
  }
}

function buildSqlAndParameters(
  from: string | null,
  to: string | null,
  contract: string | null,
  begin: string | null,
  end: string | null
) {
  if (!from && !to && !contract && !begin && !end) {
    throw new Error(
      'from, to, contract, begin, end cannot all be null or empty.'
    );
  }

  let position = 4;
  let sql = '';
  const parameters = [];

  [
    {value: from, column: 'from_address'},
    {value: to, column: 'to_address'},
    {value: contract, column: 'token_address'},
  ].forEach(item => {
    if (item.value) {
      sql += `and ${item.column} = $${position++} `;
      parameters.push(unifyAddresses(item.value));
    }
  });

  if (begin) {
    sql += `and timestamp >= $${position++} `;
    parameters.push(begin);
  }

  if (end) {
    sql += `and timestamp <= $${position++}`;
    parameters.push(end);
  }

  return {sql, parameters};
}
