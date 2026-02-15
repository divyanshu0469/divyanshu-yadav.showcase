// Flexible breakpoint definition - each page defines its own
export interface Breakpoints {
  [key: string]: string; // e.g., { tablet: '1024px', mobile: '640px' }
}

// Responsive value - can be a single value or per-breakpoint
export type ResponsiveValue<T> =
  | T
  | { default: T; [breakpoint: string]: T };

export interface DesignTokens {
  breakpoints: Breakpoints;

  colors: {
    background: string;
    foreground: string;
    accent: string;
  };

  typography: {
    displayLarge: ResponsiveValue<string>;
    displayMedium: ResponsiveValue<string>;
    headingLarge: ResponsiveValue<string>;
    headingMedium: ResponsiveValue<string>;
    bodyLarge: ResponsiveValue<string>;
    bodyBase: ResponsiveValue<string>;
    bodySmall: ResponsiveValue<string>;
  };

  spacing: {
    xs: ResponsiveValue<string>;
    sm: ResponsiveValue<string>;
    md: ResponsiveValue<string>;
    lg: ResponsiveValue<string>;
    xl: ResponsiveValue<string>;
    xxl: ResponsiveValue<string>;
  };

  sizing: {
    containerPadding: ResponsiveValue<string>;
    headerGap: ResponsiveValue<string>;
    [key: string]: ResponsiveValue<string>;
  };
}
