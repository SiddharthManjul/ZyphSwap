// Token types
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  chain: string;
  chainId?: number;
}

// Common token lists
export const ETHEREUM_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    chain: 'ethereum',
    chainId: 1,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    chain: 'ethereum',
    chainId: 1,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    chain: 'ethereum',
    chainId: 1,
  },
];

export const SOLANA_TOKENS_LIST: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    chain: 'solana',
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    chain: 'solana',
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    chain: 'solana',
  },
];

export const POLYGON_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000001010',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    chain: 'polygon',
    chainId: 137,
  },
  {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    chain: 'polygon',
    chainId: 137,
  },
];

export const ALL_TOKENS = [...ETHEREUM_TOKENS, ...SOLANA_TOKENS_LIST, ...POLYGON_TOKENS];

// Chain types
export interface Chain {
  id: string;
  name: string;
  logo: string;
  rpcUrl?: string;
  blockExplorer?: string;
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    id: 'solana',
    name: 'Solana',
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  },
  {
    id: 'zcash',
    name: 'Zcash',
    logo: 'https://assets.coingecko.com/coins/images/486/small/circle-zcash-color.png',
  },
];
