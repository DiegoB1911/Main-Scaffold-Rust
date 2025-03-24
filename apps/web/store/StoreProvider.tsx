"use client";

import { createContext, type ReactNode, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createStore } from "@/store/createStore";

export type StoreType = ReturnType<typeof createStore>;
export const ZustandContext = createContext<StoreType | null>(null);

// Componente interno que usa useSearchParams
function StoreProviderInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;

  const [store] = useState(() =>
    createStore({
      url,
    }),
  );

  return (
    <ZustandContext.Provider value={store}>{children}</ZustandContext.Provider>
  );
}

// Componente envoltorio con Suspense
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreProviderInner>{children}</StoreProviderInner>
    </Suspense>
  );
};
