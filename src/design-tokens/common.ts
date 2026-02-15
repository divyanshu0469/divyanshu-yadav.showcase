// Fixed tokens for shared components - consistent across all pages
export const commonTokens = {
  toolbar: {
    buttonSize: "4rem",
    iconSize: "1.5rem",
  },
  // Add more common components as needed
};

// Generate CSS for common tokens (applied globally in globals.css)
export function generateCommonCSS(): string {
  return `
:root {
  --common-toolbar-button-size: ${commonTokens.toolbar.buttonSize};
  --common-toolbar-icon-size: ${commonTokens.toolbar.iconSize};
}
`.trim();
}
