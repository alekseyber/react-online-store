import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  export interface Palette {
    darkprimary: Palette["primary"];
  }
  export interface PaletteOptions {
    darkprimary?: PaletteOptions["primary"];
  }
}

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#111111", ///3f50b5
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#fff",
    },
    darkprimary: {
      light: "#99999",
      dark: "#00000",
      main: "#111111",
      contrastText: "#fffff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",

      //dark: "#111111",
    },
    success: {
      light: "#81c784",
      main: "#4caf50",
      dark: "#388e3c",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
  },
});

export default theme;
