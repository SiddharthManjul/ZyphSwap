/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import axios from 'axios';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY';

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot?: number;
  timeTaken?: number;
}

export interface JupiterSwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

export class JupiterClient {
  private connection: Connection;

  constructor(rpcUrl: string = HELIUS_RPC) {
    // Using Helius RPC for Solana - CRITICAL for bounty
    this.connection = new Connection(rpcUrl, 'confirmed');
    console.log('Jupiter client initialized with Helius RPC');
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps: number = 50
  ): Promise<JupiterQuote> {
    try {
      const params = {
        inputMint,
        outputMint,
        amount,
        slippageBps,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
      };

      const response = await axios.get(`${JUPITER_API}/quote`, { params });

      if (!response.data) {
        throw new Error('No quote received from Jupiter');
      }

      return response.data;
    } catch (error: any) {
      console.error('Jupiter quote error:', error.response?.data || error.message);
      throw new Error(`Failed to get Jupiter quote: ${error.response?.data?.error || error.message}`);
    }
  }

  async getSwapTransaction(
    quote: JupiterQuote,
    userPublicKey: string,
    wrapAndUnwrapSol: boolean = true,
    prioritizationFeeLamports?: number
  ): Promise<JupiterSwapResponse> {
    try {
      const body: any = {
        quoteResponse: quote,
        userPublicKey,
        wrapAndUnwrapSol,
        computeUnitPriceMicroLamports: prioritizationFeeLamports || 'auto',
        asLegacyTransaction: false,
      };

      const response = await axios.post(`${JUPITER_API}/swap`, body);

      if (!response.data) {
        throw new Error('No swap transaction received from Jupiter');
      }

      return response.data;
    } catch (error: any) {
      console.error('Jupiter swap error:', error.response?.data || error.message);
      throw new Error(`Failed to get swap transaction: ${error.response?.data?.error || error.message}`);
    }
  }

  async executeSwap(
    swapTransaction: string,
    wallet: any
  ): Promise<string> {
    try {
      // Deserialize the transaction
      const transactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);

      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send the transaction
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          maxRetries: 2,
        }
      );

      // Confirm the transaction
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      console.log('Swap executed successfully:', signature);
      return signature;
    } catch (error: any) {
      console.error('Jupiter execute swap error:', error);
      throw new Error(`Failed to execute swap: ${error.message}`);
    }
  }

  async getTokenInfo(mint: string): Promise<any> {
    try {
      const response = await axios.get(`https://token.jup.ag/strict`, {
        params: { mint },
      });

      return response.data;
    } catch (error: any) {
      console.error('Jupiter token info error:', error);
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}

// Singleton instance using Helius RPC
export const jupiterClient = new JupiterClient(HELIUS_RPC);

// Common Solana token mints
export const SOLANA_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
};
