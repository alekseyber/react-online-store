import { red, green } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles"; //, adaptV4Theme

declare module "@mui/material/styles/createPalette" {
  export interface Palette {
    darkprimary: Palette["primary"];
    priceprimary: Palette["primary"];
  }
  export interface PaletteOptions {
    darkprimary?: PaletteOptions["primary"];
    priceprimary?: Palette["primary"];
  }
}

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#111111", ///3f50b5
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: red[600], //#ac7904 /зол #f44336 /кр
      dark: "#ba000d",
      contrastText: "#fff",
    },
    darkprimary: {
      light: "#99999",
      dark: "#00000",
      main: "#111111",
      contrastText: "#fffff",
    },
    priceprimary: {
      light: "rgba(0,0,0,.6)", //old price
      dark: green[800], //summ cart
      main: red[600], // price
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
  },
});

export default theme;

export const themeBtnAddCart = createTheme({
  palette: {
    primary: {
      //btn add cart
      main: green[500],
      contrastText: "#fff",
    },
    secondary: {
      // btn qorder
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
  },
});
