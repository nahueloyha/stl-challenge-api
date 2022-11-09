export type TokenType = 'erc20' | 'erc721' | 'erc1155';

export type TokenMetadata = {
  address: string;
  tokenType: TokenType;
  symbol: string;
  name: string;
  decimals?: number;
  metadata?: any;
  totalSupply: string;
  chainId: number;
};

export type TokenHistory = {
  from: string;
  to?: string;
  tokenAddress: string;
  tokenType: TokenType;
  txHash: string;
  eventName: string;
  encodedEvent: number;
  details?: any;
  timestamp: number;
  chainId: number;
};

export type Erc20Balance = {
  address: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  chainId: number;
};

export function isEmptyOrNull(values: any) {
  if (!values) {
    return true;
  } else if (Array.isArray(values) && !values.length) {
    return true;
  }

  return false;
}
