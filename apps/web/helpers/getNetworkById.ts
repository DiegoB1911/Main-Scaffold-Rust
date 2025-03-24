import { NetworkOptions } from "@/constants/settings";
import type { NetworkType } from "@/types/types";

export const getNetworkById = (networkId: NetworkType) => {
  return NetworkOptions.find((op) => op.id === networkId);
};
