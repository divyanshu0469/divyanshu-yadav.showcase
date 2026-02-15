export type { DesignTokens, ResponsiveValue, Breakpoints } from "./types";
export { effect1Theme, homeTheme } from "./themes";
export { commonTokens, generateCommonCSS } from "./common";
export { generateThemeCSS } from "./generator";

import type { DesignTokens } from "./types";
import { effect1Theme, homeTheme } from "./themes";

// Registry of all themes
export const themes: Record<string, DesignTokens> = {
  "1ffect": effect1Theme,
  home: homeTheme,
};
