import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import App from "./App";
import theme from "./theme";
import "./index.scss";
import { client } from "./apolloClient";
import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
