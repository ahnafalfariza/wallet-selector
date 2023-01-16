import type {
  HereInitializeOptions,
  HereWalletProtocol,
  SignMessageOptions,
  SignMessageReturn,
} from "@here-wallet/core";

import type {
  WalletBehaviourFactory,
  InjectedWallet,
} from "@paras-wallet-selector/core";

type LegacySign = { signerId?: string; message: Uint8Array; receiver?: string };
type SignOptions = SignMessageOptions | LegacySign;

export type HereWallet = Omit<InjectedWallet, "signMessage"> &
  Omit<Omit<HereWalletProtocol, "getAccounts">, "signIn"> & {
    signMessage: (data: SignOptions) => Promise<SignMessageReturn>;
  };

export type SelectorInit = WalletBehaviourFactory<
  HereWallet,
  HereInitializeOptions
>;
