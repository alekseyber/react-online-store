import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import theme from "./theme";
import "./index.scss";
import { client } from "./apolloClient";

//</React.StrictMode>,

// if (process.env.NODE_ENV === 'production') {
//   config.set({ baseUrl: '' });
// } else {
//   config.set({ baseUrl: 'http://localhost:5000' });
// }

render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
