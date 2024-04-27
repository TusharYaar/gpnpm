import light_theme from "./light_theme.json";

const Themes = {
  light_theme: {theme: light_theme, label: "Primary Theme"},
} as const;
export default Themes;

export const Fonts = ["Lexend", "KodeMono", "monospace"] as const;
