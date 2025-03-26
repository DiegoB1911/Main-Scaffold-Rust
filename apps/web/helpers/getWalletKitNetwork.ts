import type { NetworkType } from "@/types/types";

import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

export const getWalletKitNetwork = (network: NetworkType) => {
  console.log("getWalletKitNetwork called with:", network);
  
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let result;
  switch (network) {
    case "testnet":
      result = WalletNetwork.TESTNET;
      break;
    case "mainnet":
      result = WalletNetwork.PUBLIC;
      break;
    case "futurenet":
      result = WalletNetwork.FUTURENET;
      break;
    // @TODO: stellar wallets kit doesn't support CUSTOM
    //   case "custom":
    default:
      result = WalletNetwork.TESTNET;
      break;
  }
  
  console.log("getWalletKitNetwork returning:", result);
  return result;
};
