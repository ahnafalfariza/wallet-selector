import { Component, OnInit } from "@angular/core";
import { setupWalletSelector } from "@paras-wallet-selector/core";
import type { WalletSelector, AccountState } from "@paras-wallet-selector/core";
import { setupNearWallet } from "@paras-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@paras-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@paras-wallet-selector/here-wallet";
import { setupSender } from "@paras-wallet-selector/sender";
import { setupMathWallet } from "@paras-wallet-selector/math-wallet";
import { setupNightly } from "@paras-wallet-selector/nightly";
import { setupLedger } from "@paras-wallet-selector/ledger";
import { setupWalletConnect } from "@paras-wallet-selector/wallet-connect";
import { setupNightlyConnect } from "@paras-wallet-selector/nightly-connect";
import { setupModal } from "@paras-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@paras-wallet-selector/modal-ui";
import { CONTRACT_ID } from "../constants";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

@Component({
  selector: "paras-wallet-selector-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accountId: string | null;
  accounts: Array<AccountState> = [];

  async ngOnInit() {
    await this.initialize().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }

  async initialize() {
    const _selector = await setupWalletSelector({
      network: "testnet",
      debug: true,
      modules: [
        setupNearWallet(),
        setupMyNearWallet(),
        setupHereWallet(),
        setupSender(),
        setupMathWallet(),
        setupNightly(),
        setupLedger(),
        setupWalletConnect({
          projectId: "c4f79cc...",
          metadata: {
            name: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            url: "https://github.com/near/wallet-selector",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        }),
        setupNightlyConnect({
          url: "wss://ncproxy.nightly.app/app",
          appMetadata: {
            additionalInfo: "",
            application: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
          },
        }),
      ],
    });

    const _modal = setupModal(_selector, { contractId: CONTRACT_ID });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.accountId =
      state.accounts.find((account) => account.active)?.accountId || null;

    window.selector = _selector;
    window.modal = _modal;

    this.selector = _selector;
    this.modal = _modal;
  }
}
