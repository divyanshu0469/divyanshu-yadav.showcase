import type { DesignTokens } from "../types";

export const homeTheme: DesignTokens = {
  // Custom breakpoints for home page
  breakpoints: {
    tablet: "768px",
    mobile: "480px",
  },

  colors: {
    background: "#fafafa",
    foreground: "#ffffff",
    accent: "#000000",
  },

  typography: {
    displayLarge: {
      default: "3rem",
      tablet: "2.5rem",
      mobile: "2rem",
    },
    displayMedium: {
      default: "2rem",
    },
    headingLarge: {
      default: "1.5rem",
      tablet: "1.25rem",
      mobile: "1.125rem",
    },
    headingMedium: {
      default: "1.25rem",
    },
    bodyLarge: {
      default: "1.125rem",
    },
    bodyBase: {
      default: "1rem",
    },
    bodySmall: {
      default: "0.875rem",
    },
  },

  spacing: {
    xs: { default: "0.25rem" },
    sm: { default: "0.5rem" },
    md: { default: "1rem" },
    lg: { default: "1.5rem" },
    xl: { default: "2rem" },
    xxl: { default: "4rem" },
  },

  sizing: {
    containerPadding: { default: "2rem", tablet: "1.5rem", mobile: "1rem" },
    headerGap: { default: "1rem" },
  },
};
