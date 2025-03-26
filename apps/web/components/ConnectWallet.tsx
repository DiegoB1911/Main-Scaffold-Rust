import { useContext, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

import { WalletKitContext } from "@/components/WalletKitContextProvider";

export const ConnectWallet = () => {
  const { network, account } = useStore();
  const { updateWalletKitPubKey } = account;

  // using Ref because it needs to be called only once
  // on dev, strict mode forces it to call it twice which prompts an error modal
  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const walletKitInstance = useContext(WalletKitContext);

  const createWalletKitButton = async () => {
    console.log("Creating wallet button with network:", network.horizonUrl);
    try {
      await walletKitInstance.walletKit?.createButton({
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        container: responseSuccessEl.current!,
        onConnect: ({ address }) => {
          console.log("Wallet connected with address:", address);
          updateWalletKitPubKey(address);
        },
        onDisconnect: () => {
          console.log("Wallet disconnected");
          updateWalletKitPubKey(undefined);
        },
        horizonUrl: network.horizonUrl || "",
      });
    } catch (error) {
      console.error("Error creating wallet button:", error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initButton = async () => {
      console.log("Initializing wallet button");
      await createWalletKitButton();
    };

    if (!walletKitInstance.walletKit?.isButtonCreated()) {
      initButton();
    }

    return () => {
      console.log("Removing wallet button");
      walletKitInstance.walletKit?.removeButton({ skipDisconnect: true });
    };
    // Run only when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // biome-ignore lint/style/useSelfClosingElements: <explanation>
  return <div className="ConnectWallet" ref={responseSuccessEl}></div>;
};
