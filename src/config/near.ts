export const NEAR_CONFIG = {
  networkId: process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet',
  nodeUrl: process.env.NEXT_PUBLIC_NEAR_NODE_URL || 'https://rpc.testnet.near.org',
  walletUrl: process.env.NEXT_PUBLIC_NEAR_WALLET_URL || 'https://testnet.mynearwallet.com',
  helperUrl: process.env.NEXT_PUBLIC_NEAR_HELPER_URL || 'https://helper.testnet.near.org',
  explorerUrl: 'https://testnet.nearblocks.io',
  contractId: process.env.NEXT_PUBLIC_NEAR_INTENTS_CONTRACT || 'intents.testnet',
};
