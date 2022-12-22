import {
  WalletModuleFactory,
  BrowserWallet,
  Network,
} from "@paras-wallet-selector/core";
import {
  setupMyNearWallet,
  MyNearWalletParams,
} from "@paras-wallet-selector/my-near-wallet";

export type NearWalletParams = MyNearWalletParams;

const resolveWalletUrl = (network: Network, walletUrl?: string) => {
  if (walletUrl) {
    return walletUrl;
  }

  switch (network.networkId) {
    case "mainnet":
      return "https://wallet.near.org";
    case "testnet":
      return "https://wallet.testnet.near.org";
    default:
      throw new Error("Invalid wallet url");
  }
};

export function setupNearWallet({
  walletUrl,
  iconUrl = "./assets/near-wallet-icon.png",
  successUrl = "",
  failureUrl = "",
}: NearWalletParams = {}): WalletModuleFactory<BrowserWallet> {
  return async (options) => {
    const wallet = await setupMyNearWallet({
      successUrl: successUrl,
      failureUrl: failureUrl,
      walletUrl: resolveWalletUrl(options.options.network, walletUrl),
      iconUrl,
    })(options);

    if (!wallet) {
      return null;
    }

    return {
      ...wallet,
      id: "near-wallet",
      metadata: {
        ...wallet.metadata,
        name: "NEAR Wallet",
        description: null,
        iconUrl,
        deprecated: false,
        available: true,
      },
    };
  };
}
