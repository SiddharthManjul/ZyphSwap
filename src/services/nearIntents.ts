/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WalletSelector } from '@near-wallet-selector/core';
import type { providers } from 'near-api-js';
import { NEAR_CONFIG } from '@/config/near';

export interface SwapIntent {
  action: 'private_swap';
  sourceChain: string;
  destChain: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  privacyLevel: 'standard' | 'maximum';
}

export interface ExecutionPlan {
  intentId: string;
  steps: ExecutionStep[];
  estimatedGas: string;
  estimatedTime: number;
}

export interface ExecutionStep {
  chain: string;
  action: string;
  protocol: string;
  data: any;
}

export class NEARIntentService {
  private selector: WalletSelector | null = null;

  constructor(selector: WalletSelector | null = null) {
    this.selector = selector;
  }

  setSelector(selector: WalletSelector) {
    this.selector = selector;
  }

  async createSwapIntent(intent: SwapIntent): Promise<string> {
    if (!this.selector) {
      throw new Error('Wallet selector not initialized. Please connect your NEAR wallet.');
    }

    const wallet = await this.selector.wallet();
    const accounts = await wallet.getAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts connected. Please connect your NEAR wallet.');
    }

    try {
      // Note: This is a placeholder for NEAR Intents SDK integration
      // In production, use the actual contract method once deployed
      console.warn('NEAR Intents contract not yet deployed. This is a placeholder.');

      const result = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: NEAR_CONFIG.contractId,
            actions: [
              {
                methodName: 'create_swap_intent',
                args: intent,
                gas: '300000000000000', // 300 TGas
                deposit: '0',
              } as any,
            ],
          },
        ],
      });

      console.log('Intent created:', result);
      return 'Transaction submitted';
    } catch (error) {
      console.error('Failed to create intent:', error);
      throw error;
    }
  }

  async getExecutionPlan(intentId: string): Promise<ExecutionPlan> {
    if (!this.selector) {
      throw new Error('Wallet selector not initialized');
    }

    // For view methods, we don't need wallet connection
    // This would use near-api-js or RPC directly for view calls
    throw new Error('View function not yet implemented with wallet selector');
  }

  async executeIntent(intentId: string): Promise<string> {
    if (!this.selector) {
      throw new Error('Wallet selector not initialized');
    }

    const wallet = await this.selector.wallet();
    const accounts = await wallet.getAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts connected');
    }

    try {
      console.warn('NEAR Intents contract not yet deployed. This is a placeholder.');

      const result = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: NEAR_CONFIG.contractId,
            actions: [
              {
                methodName: 'execute_intent',
                args: { intent_id: intentId },
                gas: '300000000000000',
                deposit: '0',
              } as any,
            ],
          },
        ],
      });

      console.log('Intent executed:', result);
      return 'Transaction submitted';
    } catch (error) {
      console.error('Failed to execute intent:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    if (!this.selector) return false;
    const state = this.selector.store.getState();
    return state.accounts.length > 0;
  }

  getAccountId(): string | null {
    if (!this.selector) return null;
    const state = this.selector.store.getState();
    return state.accounts.length > 0 ? state.accounts[0].accountId : null;
  }
}

// Singleton instance
let nearIntentService: NEARIntentService | null = null;

export function getNEARIntentService(selector?: WalletSelector): NEARIntentService {
  if (!nearIntentService) {
    nearIntentService = new NEARIntentService(selector);
  } else if (selector) {
    nearIntentService.setSelector(selector);
  }
  return nearIntentService;
}

export const nearIntents = getNEARIntentService();
