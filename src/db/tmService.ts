import {db} from '../constant';
import {unifyAddresses} from './dbService';

export async function findTokenMetadataByAddress(
  chainId: number,
  address: string
) {
  try {
    const sql =
      'select * from token_metadata where chain_id = $1 and address = $2 limit 1';
    const rows = await db.safeQuery(sql, [chainId, unifyAddresses(address)]);
    if (rows.length) {
      return {
        address: rows[0]['address'],
        tokenType: rows[0]['token_type'],
        symbol: rows[0]['symbol'],
        name: rows[0]['name'],
        decimals: rows[0]['decimals'],
        metadata: JSON.stringify(rows[0]['metadata']),
        totalSupply: rows[0]['total_supply'],
        chainId: rows[0]['chain_id'],
        logo: rows[0]['logo'],
        totalSupplyRaw: rows[0]['total_supply_raw'],
      };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
