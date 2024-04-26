import light_theme from "./light_theme.json";
import dark_theme from "./dark_theme.json";
import { createTheme } from "@mantine/core";

const Themes = {
  dark_theme: createTheme(dark_theme as unknown),
  light_theme: createTheme(light_theme as unknown),
} as const;
export default Themes;
