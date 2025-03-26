"use client";

import { createContext, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  XBULL_ID,
  allowAllModules,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";

type WalletKitProps = {
  walletKit?: StellarWalletsKit;
};

export const WalletKitContext = createContext<WalletKitProps>({
  walletKit: undefined,
});

export const WalletKitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, theme, setTheme } = useStore();
  const networkType = getWalletKitNetwork(network.id);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const savedTheme = localStorageSavedTheme.get();
    console.log("WalletKitContextProvider initialized with network:", network);
    console.log("Network type:", networkType);

    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Run only when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const walletKitInstance = useMemo(() => {
    console.log("Creating WalletKit instance with network:", networkType);
    const isDarkTheme = theme === "sds-theme-dark";

    const commonDarkTheme = {
      bgColor: "#161616",
      textColor: "#fcfcfc",
      solidTextColor: "#fcfcfc",
      dividerColor: "#fcfcfc",
    };

    const commonLightTheme = {
      bgColor: "#fcfcfc",
      textColor: "#161616",
      solidTextColor: "#161616",
      dividerColor: "#161616",
    };

    const modalDarkTheme = {
      ...commonDarkTheme,
      dividerColor: "#161616",
      headerButtonColor: "#161616",
      helpBgColor: "#161616",
      notAvailableTextColor: "#fcfcfc",
      notAvailableBgColor: "#161616",
      notAvailableBorderColor: "#fcfcfc",
    };

    const modalLightTheme = {
      ...commonLightTheme,
      dividerColor: "#fcfcfc",
      headerButtonColor: "#fcfcfc",
      helpBgColor: "#fcfcfc",
      notAvailableTextColor: "#161616",
      notAvailableBgColor: "#fcfcfc",
      notAvailableBorderColor: "#161616",
    };

    // Ensure we have a valid network, defaulting to TESTNET if not
    const network = networkType || WalletNetwork.TESTNET;
    
    try {
      return new StellarWalletsKit({
        network,
        selectedWalletId: XBULL_ID,
        modules: allowAllModules(),
        ...(theme && {
          buttonTheme: isDarkTheme
            ? {
                ...commonDarkTheme,
                buttonPadding: "0.5rem 1.25rem",
                buttonBorderRadius: "0.5rem",
              }
            : {
                ...commonLightTheme,
                buttonPadding: "0.5rem 1.25rem",
                buttonBorderRadius: "0.5rem",
              },
          modalTheme: isDarkTheme ? modalDarkTheme : modalLightTheme,
        }),
      });
    } catch (error) {
      console.error("Error creating StellarWalletsKit instance:", error);
      return undefined;
    }
  }, [networkType, theme]);

  return (
    <WalletKitContext.Provider value={{ walletKit: walletKitInstance }}>
      {children}
    </WalletKitContext.Provider>
  );
};
