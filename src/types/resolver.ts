import {
  findAllErc20BalancesByAddressAndContracts,
  findErc20Balance,
} from '../db/ebService';
import {
  findAllNftsByAddressAndContracts,
  findNftByAddressAndTokenId,
} from '../db/ndService';
import {findAllTokenHistories} from '../db/thService';
import {findTokenMetadataByAddress} from '../db/tmService';

export function metadataResolver(root: any, args: any, ctx: any) {
  return findTokenMetadataByAddress(args.chainId, args.contract);
}

export function balanceResolver(root: any, args: any, ctx: any) {
  return findErc20Balance(
    args.chainId,
    args.account,
    args.contract,
    args.verbose
  );
}

export function allBalancesResolver(root: any, args: any, ctx: any) {
  return findAllErc20BalancesByAddressAndContracts(
    args.chainId,
    args.account,
    args.contracts,
    {
      sort: 'id',
      max: args.max,
      startAfter: args.startAfter,
      order: args.order,
    },
    args.verbose
  );
}

export function nftResolver(root: any, args: any, ctx: any) {
  return findNftByAddressAndTokenId(
    args.chainId,
    args.contract,
    args.tokenId,
    args.verbose
  );
}

export function allNftsResolver(root: any, args: any, ctx: any) {
  return findAllNftsByAddressAndContracts(
    args.chainId,
    args.account,
    args.contracts,
    {
      sort: 'id',
      max: args.max,
      startAfter: args.startAfter,
      order: args.order,
    },
    args.verbose
  );
}

export function allHistoriesResolver(root: any, args: any, ctx: any) {
  return findAllTokenHistories(
    args.chainId,
    args.from,
    args.to,
    args.contract,
    args.begin,
    args.end,
    {
      sort: 'id',
      max: args.max,
      startAfter: args.startAfter,
      order: args.order,
    }
  );
}
