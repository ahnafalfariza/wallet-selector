import type {
  WalletModuleFactory,
  WalletBehaviourFactory,
  BrowserWallet,
} from "@paras-wallet-selector/core";
import { createAction } from "@paras-wallet-selector/wallet-utils";
import BN from "bn.js";
import icon from "./icon";
import {
  getHereBalance,
  HereConfiguration,
  hereConfigurations,
  setupWalletState,
  transformTransactions,
} from "./utils";

export type HereWallet = BrowserWallet & {
  getHereBalance: () => Promise<BN>;
  getAvailableBalance: () => Promise<BN>;
};

export const initHereWallet: WalletBehaviourFactory<
  HereWallet,
  { configuration: HereConfiguration }
> = async ({ store, logger, options, configuration }) => {
  const _state = await setupWalletState(configuration, options.network);

  const getAccounts = () => {
    const accountId: string | null = _state.wallet.getAccountId();
    if (!accountId) {
      return [];
    }

    return [{ accountId }];
  };

  return {
    async signIn({ contractId, methodNames }) {
      const existingAccounts = getAccounts();

      if (existingAccounts.length) {
        return existingAccounts;
      }

      await _state.wallet.requestSignIn({ contractId, methodNames });
      return getAccounts();
    },

    async getHereBalance() {
      return await getHereBalance(_state, configuration);
    },

    async getAvailableBalance(): Promise<BN> {
      const result = await _state.wallet.account().getAccountBalance();
      const hereBalance = await getHereBalance(_state, configuration);
      return new BN(result.available).add(new BN(hereBalance));
    },

    async signOut() {
      if (_state.wallet.isSignedIn()) {
        _state.wallet.signOut();
      }
    },

    async getAccounts() {
      return getAccounts();
    },

    async signAndSendTransaction({
      signerId,
      receiverId,
      actions,
      callbackUrl,
    }) {
      logger.log("HereWallet:signAndSendTransaction", {
        signerId,
        receiverId,
        actions,
        callbackUrl,
      });

      const { contract } = store.getState();

      if (!_state.wallet.isSignedIn() || !contract) {
        throw new Error("Wallet not signed in");
      }

      const account = _state.wallet.account();
      return account["signAndSendTransaction"]({
        receiverId: receiverId || contract.contractId,
        actions: actions.map((action) => createAction(action)),
        walletCallbackUrl: callbackUrl,
      });
    },

    async signMessage({ signerId, message }) {
      const account = _state.wallet.account();

      if (!account) {
        throw new Error("Wallet not signed in");
      }

      return account.connection.signer.signMessage(
        message,
        signerId || account.accountId,
        options.network.networkId
      );
    },

    async signAndSendTransactions({ transactions, callbackUrl }) {
      logger.log("HereWallet:signAndSendTransactions", {
        transactions,
        callbackUrl,
      });

      if (!_state.wallet.isSignedIn()) {
        throw new Error("Wallet not signed in");
      }

      return _state.wallet.requestSignTransactions({
        transactions: await transformTransactions(_state, transactions),
        callbackUrl,
      });
    },
  };
};

export function setupHereWallet({
  deprecated = false,
  iconUrl = icon,
} = {}): WalletModuleFactory<HereWallet> {
  return async ({ options }) => {
    const configuration = hereConfigurations[options.network.networkId];
    if (configuration == null) {
      return null;
    }

    return {
      id: "here-wallet",
      type: "browser",
      metadata: {
        name: "Here Wallet (mobile)",
        description: "Mobile wallet for NEAR Protocol",
        iconUrl,
        deprecated,
        available: true,
      },
      init: (config) => initHereWallet({ ...config, configuration }),
    };
  };
}
