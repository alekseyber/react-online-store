//import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
//import "./index.scss";
import "./index.css";
import { client } from "./apolloClient";
import reportWebVitals from "./reportWebVitals";
import { unregister } from "./serviceWorker";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

render(
  <ApolloProvider client={client}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//serviceWorker
unregister();
//register();
