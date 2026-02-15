import type { DesignTokens, ResponsiveValue } from "./types";

// Convert camelCase to kebab-case
function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// Get value for a specific breakpoint from a responsive value
function getValueForBreakpoint<T>(
  value: ResponsiveValue<T>,
  breakpoint: string
): T | undefined {
  if (typeof value === "object" && value !== null && "default" in value) {
    const responsiveValue = value as { default: T; [key: string]: T };
    return responsiveValue[breakpoint];
  }
  // Non-responsive value - only return for 'default'
  return breakpoint === "default" ? (value as T) : undefined;
}

// Generate CSS variables for a specific breakpoint
function generateVariables(
  tokens: DesignTokens,
  breakpoint: string,
  indent = "  "
): string {
  let vars = "";

  // Colors (not responsive - only output on default)
  if (breakpoint === "default") {
    vars += `${indent}--color-bg: ${tokens.colors.background};\n`;
    vars += `${indent}--color-fg: ${tokens.colors.foreground};\n`;
    vars += `${indent}--color-accent: ${tokens.colors.accent};\n`;
  }

  // Typography
  for (const [key, value] of Object.entries(tokens.typography)) {
    const val = getValueForBreakpoint(value, breakpoint);
    if (val !== undefined) {
      vars += `${indent}--typo-${camelToKebab(key)}: ${val};\n`;
    }
  }

  // Spacing
  for (const [key, value] of Object.entries(tokens.spacing)) {
    const val = getValueForBreakpoint(value, breakpoint);
    if (val !== undefined) {
      vars += `${indent}--spacing-${key}: ${val};\n`;
    }
  }

  // Sizing
  for (const [key, value] of Object.entries(tokens.sizing)) {
    const val = getValueForBreakpoint(value, breakpoint);
    if (val !== undefined) {
      vars += `${indent}--sizing-${camelToKebab(key)}: ${val};\n`;
    }
  }

  return vars;
}

// Generate complete CSS string with media queries for a theme
export function generateThemeCSS(
  themeName: string,
  tokens: DesignTokens
): string {
  const { breakpoints } = tokens;

  // Base variables (default values)
  let css = `[data-theme="${themeName}"] {\n`;
  css += generateVariables(tokens, "default");
  css += "}\n";

  // Sort breakpoints by width (largest first for desktop-first approach)
  const sortedBreakpoints = Object.entries(breakpoints).sort((a, b) => {
    const widthA = Number.parseInt(a[1], 10);
    const widthB = Number.parseInt(b[1], 10);
    return widthB - widthA;
  });

  // Media queries for each breakpoint
  for (const [name, width] of sortedBreakpoints) {
    const vars = generateVariables(tokens, name, "    ");
    if (vars.trim()) {
      css += `\n@media (max-width: ${width}) {\n`;
      css += `  [data-theme="${themeName}"] {\n`;
      css += vars;
      css += "  }\n";
      css += "}\n";
    }
  }

  return css;
}
