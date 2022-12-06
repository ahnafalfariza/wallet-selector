import type { NetworkId } from "@paras-wallet-selector/core";
import { HereWallet } from "@here-wallet/core";
import type BN from "bn.js";

import type { SelectorInit } from "./types";

export const initHereWallet: SelectorInit = async (config) => {
  const { store, logger, emitter, options, ...hereOpts } = config;

  const here = await HereWallet.initialize({
    network: options.network.networkId as NetworkId,
    ...hereOpts,
  });

  return {
    async signIn(data) {
      logger.log("HereWallet:signIn");

      const account = await here.signIn(data);
      emitter.emit("signedIn", {
        contractId: data.contractId,
        methodNames: data.methodNames ?? [],
        accounts: [{ accountId: account }],
      });

      return [{ accountId: account }];
    },

    async getHereBalance() {
      logger.log("HereWallet:getHereBalance");
      return await here.getHereBalance();
    },

    async getAvailableBalance(): Promise<BN> {
      logger.log("HereWallet:getAvailableBalance");
      return await here.getAvailableBalance();
    },

    async signOut() {
      logger.log("HereWallet:signOut");
      return here.signOut();
    },

    async getAccounts() {
      logger.log("HereWallet:getAccounts");
      return here.isSignedIn ? [{ accountId: here.getAccountId() }] : [];
    },

    async signAndSendTransaction(data) {
      logger.log("HereWallet:signAndSendTransaction", data);

      const { contract } = store.getState();
      if (!here.isSignedIn || !contract) {
        throw new Error("Wallet not signed in");
      }

      return await here.signAndSendTransaction({
        receiverId: contract.contractId,
        ...data,
      });
    },

    async verifyOwner() {
      logger.log("HereWallet:verifyOwner");
      throw new Error("verifyOwner is not support");
    },

    async signMessage({ signerId, message }) {
      logger.log("HereWallet:signMessage", { signerId, message });
      return await here.signMessage({
        signerId: signerId ?? here.getAccountId(),
        message,
      });
    },

    async signAndSendTransactions(data) {
      logger.log("HereWallet:signAndSendTransactions", data);
      return await here.signAndSendTransactions(data);
    },
  };
};
