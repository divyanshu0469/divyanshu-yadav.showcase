import type { DesignTokens } from "../types";

export const effect1Theme: DesignTokens = {
  // Custom breakpoints for this page
  breakpoints: {
    lgDesktop: "1280px",
    tablet: "1024px",
    lgMobile: "768px",
    mobile: "640px",
  },

  colors: {
    background: "#000000",
    foreground: "#d92330",
    accent: "#f3f0f0",
  },

  typography: {
    // largeText: 10rem → 8rem → 6rem → 4.5rem → 3rem
    displayLarge: {
      default: "10rem",
      lgDesktop: "8rem",
      tablet: "6rem",
      lgMobile: "4.5rem",
      mobile: "3rem",
    },
    // preloader number
    displayMedium: {
      default: "8rem",
    },
    // smallText: 1.875rem → 1.5rem → 1.25rem → 1.125rem
    headingLarge: {
      default: "1.875rem",
      tablet: "1.5rem",
      lgMobile: "1.25rem",
      mobile: "1.125rem",
    },
    headingMedium: {
      default: "1.5rem",
    },
    bodyLarge: {
      default: "1.25rem",
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
    sm: { default: "0.5rem" }, // header gap, innerContainer padding
    md: { default: "1rem" }, // header padding
    lg: { default: "1.5rem" },
    xl: { default: "2rem" },
    xxl: { default: "4rem" },
  },

  sizing: {
    containerPadding: { default: "1rem" },
    headerGap: { default: "0.5rem" },
    numberWrapperHeight: { default: "8rem" },
  },
};
