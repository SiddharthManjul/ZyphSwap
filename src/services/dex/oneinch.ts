/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const ONEINCH_API = 'https://api.1inch.dev/swap/v6.0';
const API_KEY = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
}

export interface Quote {
  dstAmount: string;
  srcAmount: string;
  protocols: any[];
  estimatedGas: string;
  tx?: {
    from: string;
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

export class OneInchClient {
  private baseURL: string;
  private chainId: number;

  constructor(chainId: number) {
    this.chainId = chainId;
    this.baseURL = `${ONEINCH_API}/${chainId}`;
  }

  async getQuote(
    srcToken: string,
    dstToken: string,
    amount: string,
    protocols?: string
  ): Promise<Quote> {
    try {
      const params: any = {
        src: srcToken,
        dst: dstToken,
        amount: amount,
      };

      if (protocols) {
        params.protocols = protocols;
      }

      const response = await axios.get(`${this.baseURL}/quote`, {
        params,
        headers: API_KEY ? {
          'Authorization': `Bearer ${API_KEY}`,
        } : {},
      });

      return response.data;
    } catch (error: any) {
      console.error('1inch quote error:', error.response?.data || error.message);
      throw new Error(`Failed to get quote: ${error.response?.data?.description || error.message}`);
    }
  }

  async getSwapData(
    srcToken: string,
    dstToken: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1,
    protocols?: string
  ): Promise<Quote> {
    try {
      const params: any = {
        src: srcToken,
        dst: dstToken,
        amount: amount,
        from: fromAddress,
        slippage: slippage,
        disableEstimate: true,
        allowPartialFill: false,
      };

      if (protocols) {
        params.protocols = protocols;
      }

      const response = await axios.get(`${this.baseURL}/swap`, {
        params,
        headers: API_KEY ? {
          'Authorization': `Bearer ${API_KEY}`,
        } : {},
      });

      return response.data;
    } catch (error: any) {
      console.error('1inch swap error:', error.response?.data || error.message);
      throw new Error(`Failed to get swap data: ${error.response?.data?.description || error.message}`);
    }
  }

  async getTokens(): Promise<Record<string, TokenInfo>> {
    try {
      const response = await axios.get(`${this.baseURL}/tokens`, {
        headers: API_KEY ? {
          'Authorization': `Bearer ${API_KEY}`,
        } : {},
      });

      return response.data.tokens;
    } catch (error: any) {
      console.error('1inch tokens error:', error.response?.data || error.message);
      throw new Error(`Failed to get tokens: ${error.response?.data?.description || error.message}`);
    }
  }

  async getSpenderAddress(): Promise<string> {
    try {
      const response = await axios.get(`${this.baseURL}/approve/spender`, {
        headers: API_KEY ? {
          'Authorization': `Bearer ${API_KEY}`,
        } : {},
      });

      return response.data.address;
    } catch (error: any) {
      console.error('1inch spender error:', error.response?.data || error.message);
      throw new Error(`Failed to get spender: ${error.response?.data?.description || error.message}`);
    }
  }
}

// Instances for different chains
export const oneInchEthereum = new OneInchClient(1); // Ethereum mainnet
export const oneInchPolygon = new OneInchClient(137); // Polygon mainnet
export const oneInchArbitrum = new OneInchClient(42161); // Arbitrum
export const oneInchOptimism = new OneInchClient(10); // Optimism

// Testnet instances
export const oneInchSepolia = new OneInchClient(11155111); // Sepolia testnet
