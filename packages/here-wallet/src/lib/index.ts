import { hereConfigurations } from "@here-wallet/core";
import type { HereProvider, HereStrategy } from "@here-wallet/core";
import type { WalletModuleFactory } from "@paras-wallet-selector/core";
import type { HereWallet } from "./types";
import { initHereWallet } from "./selector";
import icon from "./icon";

export { icon };

interface Options {
  deprecated?: boolean;
  iconUrl?: string;
  defaultStrategy?: () => HereStrategy;
  defaultProvider?: HereProvider;
}

export function setupHereWallet({
  deprecated = false,
  iconUrl = icon,
  defaultStrategy,
  defaultProvider,
}: Options = {}): WalletModuleFactory<HereWallet> {
  return async ({ options }) => {
    const configuration = hereConfigurations[options.network.networkId];
    if (configuration == null) {
      return null;
    }

    return {
      id: "here-wallet",
      type: "injected",
      metadata: {
        name: "Here Wallet (mobile)",
        description: "Mobile wallet for NEAR Protocol",
        downloadUrl: configuration.download,
        iconUrl,
        deprecated,
        available: true,
      },
      init: (config) =>
        initHereWallet({ ...config, defaultStrategy, defaultProvider }),
    };
  };
}
