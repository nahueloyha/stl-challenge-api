import {
  arg,
  booleanArg,
  enumType,
  intArg,
  list,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import {
  allBalancesResolver,
  allHistoriesResolver,
  allNftsResolver,
  balanceResolver,
  metadataResolver,
  nftResolver,
} from './resolver';

const OrderOption = enumType({
  name: 'OrderOption',
  members: ['desc', 'asc'],
  description: 'the order of the returned items, default: asc',
});

const argsOfMetedata = {
  contract: nonNull(stringArg({description: 'contract address'})),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
};

const argsOfPagination = {
  max: nullable(
    intArg({
      description:
        'the number of max returned items, default: 100, not greater than: 1000',
    })
  ),
  startAfter: nullable(
    intArg({description: 'start id (exclusive) of fetching'})
  ),
  order: nullable(arg({type: OrderOption})),
};

const Erc20Metadata = objectType({
  name: 'Erc20Metadata',
  definition(t) {
    t.string('address');
    t.string('symbol');
    t.string('name');
    t.int('decimals');
    t.string('totalSupply');
    t.string('logo');
    t.string('totalSupplyRaw');
  },
});

const ContractMetadata = objectType({
  name: 'ContractMetadata',
  definition(t) {
    t.string('address');
    t.string('tokenType');
    t.string('symbol');
    t.string('name');
    t.string('metadata');
    t.string('totalSupply');
  },
});

const argsOfBalance = {
  account: nonNull(stringArg({description: 'eoa or contract address'})),
  contract: nonNull(stringArg({description: 'contract address'})),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
  verbose: nullable(booleanArg({description: 'returning metadata when true'})),
};

const argsOfAllBalances = {
  account: nullable(
    stringArg({
      description:
        'eoa or contract address, if null, return all nfts of all accounts. note: account and contracts cannot be null both.',
    })
  ),
  contracts: nullable(
    list(
      stringArg({
        description:
          'a contract addresses list of up to 10 items, if null or empty, return all nfts of all contracts. note: account and contracts cannot be null both.',
      })
    )
  ),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
  verbose: nullable(booleanArg({description: 'returning metadata when true'})),
  ...argsOfPagination,
};

const Balance = objectType({
  name: 'Balance',
  definition(t) {
    t.string('account');
    t.string('tokenAddress');
    t.string('symbol');
    t.string('name');
    t.int('decimals');
    t.string('balance');
    t.nullable.string('totalSupply');
    t.string('balanceRaw');
  },
});

const argsOfNft = {
  contract: nonNull(stringArg({description: 'contract address'})),
  tokenId: nonNull(stringArg({description: 'token id'})),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
  verbose: nullable(
    booleanArg({description: 'returning contract metadata when true'})
  ),
};

const argsOfAllNfts = {
  account: nullable(
    stringArg({
      description:
        'eoa or contract address, if null, return all nfts of all accounts. note: account and contracts cannot be null both.',
    })
  ),
  contracts: nullable(
    list(
      stringArg({
        description:
          'a contract addresses list of up to 10 items, if null or empty, return all nfts of all contracts. note: account and contracts cannot be null both.',
      })
    )
  ),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
  verbose: nullable(
    booleanArg({description: 'returning contract metadata when true'})
  ),
  ...argsOfPagination,
};

const Nft = objectType({
  name: 'Nft',
  definition(t) {
    t.string('owner');
    t.string('tokenAddress');
    t.string('tokenId');
    t.string('tokenType');
    t.string('symbol');
    t.string('name');
    t.string('balance');
    t.string('metadata');
    t.nullable.string('totalSupply');
    t.nullable.string('contractMetadata');
  },
});

const argsOfAllHistories = {
  from: nullable(
    stringArg({
      description:
        'eoa or contract address. if null, it will be ignored in query condition. note: from, to, contract, begin, end cannot all be null.',
    })
  ),
  to: nullable(
    stringArg({
      description:
        'eoa or contract address. if null, it will be ignored in query condition. note: from, to, contract, begin, end cannot all be null.',
    })
  ),
  contract: nullable(
    stringArg({
      description:
        'eoa or contract address. if null, it will be ignored in query condition. note: from, to, contract, begin, end cannot all be null.',
    })
  ),
  begin: nullable(
    stringArg({
      description:
        'begin time point. if null, it will be ignored in query condition. note: from, to, contract, begin, end cannot all be null.',
    })
  ),
  end: nullable(
    stringArg({
      description:
        'end time point. if null, it will be ignored in query condition. note: from, to, contract, begin, end cannot all be null.',
    })
  ),
  chainId: nonNull(
    intArg({
      description: 'chain id',
    })
  ),
  ...argsOfPagination,
};

const History = objectType({
  name: 'History',
  definition(t) {
    t.string('from');
    t.string('to');
    t.string('tokenAddress');
    t.string('tokenType');
    t.string('txHash');
    t.string('event');
    t.string('details');
    t.string('timestamp');
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('contractMetadata', {
      type: ContractMetadata,
      args: argsOfMetedata,
      resolve: metadataResolver,
    });
    t.field('erc20Metadata', {
      type: Erc20Metadata,
      args: argsOfMetedata,
      resolve: metadataResolver,
    });
    t.field('balance', {
      type: Balance,
      args: argsOfBalance,
      resolve: balanceResolver,
    });
    t.field('allBalances', {
      type: list(Balance),
      args: argsOfAllBalances,
      resolve: allBalancesResolver,
    });
    t.field('nft', {
      type: Nft,
      args: argsOfNft,
      resolve: nftResolver,
    });
    t.field('allNfts', {
      type: list(Nft),
      args: argsOfAllNfts,
      resolve: allNftsResolver,
    });
    t.field('allHistories', {
      type: list(History),
      args: argsOfAllHistories,
      resolve: allHistoriesResolver,
    });
  },
});

export const schema = makeSchema({
  types: [Query],
});
