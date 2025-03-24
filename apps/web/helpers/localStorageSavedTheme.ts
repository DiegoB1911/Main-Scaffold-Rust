import { LOCAL_STORAGE_SAVED_THEME } from "@/constants/settings";
import type { ThemeColorType } from "@/types/types";

export const localStorageSavedTheme = {
  get: () => {
    const savedThemeString = localStorage.getItem(LOCAL_STORAGE_SAVED_THEME);
    return savedThemeString as ThemeColorType;
  },
};
