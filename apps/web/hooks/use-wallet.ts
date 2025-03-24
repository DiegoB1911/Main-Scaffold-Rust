"use client";

import { useContext, useState } from "react";
import { WalletKitContext } from "@/components/WalletKitContextProvider";
import { useStore } from "@/store/useStore";

export function useWallet() {
  const context = useContext(WalletKitContext);
  const { account } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  // Connect wallet function
  const connect = async () => {
    try {
      console.log("Connect wallet clicked");
      if (context.walletKit) {
        await context.walletKit.openModal({
          // biome-ignore lint/suspicious/noExplicitAny: APIs varían entre implementaciones
          onWalletSelected: async (wallet: any) => {
            try {
              // @ts-ignore - Las APIs pueden variar entre wallets
              const walletAddress = wallet.publicKey || wallet.address;
              if (walletAddress) {
                console.log("Connected with publicKey:", walletAddress);
                setPublicKey(walletAddress);
                setIsConnected(true);
                account.updateWalletKitPubKey?.(walletAddress);
              }
            } catch (error) {
              console.log("Error getting public key:", error);
            }
          },
          onClosed: () => {
            console.log("Modal closed");
          },
        });
      }
    } catch (error) {
      console.log("Error connecting to wallet:", error);
    }
  };

  // Disconnect wallet function
  const disconnect = async () => {
    try {
      console.log("Disconnect wallet clicked");
      if (context.walletKit) {
        await context.walletKit.disconnect();
        setPublicKey(undefined);
        setIsConnected(false);
        account.updateWalletKitPubKey?.(undefined);
      }
    } catch (error) {
      console.log("Error disconnecting wallet:", error);
    }
  };

  return {
    walletKit: context.walletKit,
    publicKey: account.walletKitPubKey || publicKey,
    isConnected: Boolean(account.walletKitPubKey) || isConnected,
    connect,
    disconnect,
  };
} 