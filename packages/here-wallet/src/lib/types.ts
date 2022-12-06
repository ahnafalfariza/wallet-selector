import type {
  HereAsyncOptions,
  HereInitializeOptions,
} from "@here-wallet/core";

import type {
  WalletBehaviourFactory,
  InjectedWallet,
  FinalExecutionOutcome,
  SignInParams,
  Account,
  Action,
  Optional,
  Transaction,
} from "@paras-wallet-selector/core";
import type { Signature } from "near-api-js/lib/utils/key_pair";
import type BN from "bn.js";

interface SignAndSendTransactionParams {
  signerId?: string;
  receiverId?: string;
  actions: Array<Action>;
}

interface SignAndSendTransactionsParams {
  transactions: Array<Optional<Transaction, "signerId">>;
}

export type HereWallet = InjectedWallet & {
  getHereBalance: () => Promise<BN>;
  getAvailableBalance: () => Promise<BN>;
  signMessage: (data: {
    message: Uint8Array;
    signerId: string;
  }) => Promise<Signature>;
  signIn: (data: SignInParams & HereAsyncOptions) => Promise<Array<Account>>;
  signAndSendTransaction: (
    data: SignAndSendTransactionParams & HereAsyncOptions
  ) => Promise<FinalExecutionOutcome>;
  signAndSendTransactions: (
    data: SignAndSendTransactionsParams & HereAsyncOptions
  ) => Promise<Array<FinalExecutionOutcome>>;
};

export type SelectorInit = WalletBehaviourFactory<
  HereWallet,
  HereInitializeOptions
>;
