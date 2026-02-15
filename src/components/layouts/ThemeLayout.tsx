import type { ReactNode } from "react";
import { useMemo } from "react";
import { themes, generateThemeCSS } from "@/design-tokens";

interface ThemeLayoutProps {
  children: ReactNode;
  theme: string;
  fontVariables?: string;
}

export function ThemeLayout({
  children,
  theme,
  fontVariables = "",
}: ThemeLayoutProps) {
  const themeConfig = themes[theme];

  // Generate CSS with media queries for this theme
  const themeCSS = useMemo(() => {
    if (!themeConfig) {
      console.warn(`Theme "${theme}" not found`);
      return "";
    }
    return generateThemeCSS(theme, themeConfig);
  }, [theme, themeConfig]);

  return (
    <>
      <style>{themeCSS}</style>
      <div
        data-theme={theme}
        className={fontVariables}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </div>
    </>
  );
}

export default ThemeLayout;
