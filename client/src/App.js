import React from "react"; //, { lazy, Suspense }
import { YMInitializer } from "react-yandex-metrika";
import { BrowserRouter as Router } from "react-router-dom"; //BrowserRouter as Router
import { useRoutes } from "./router";
import Layout from "./containers/layout/Layout";

const gaOn = process.env.REACT_APP_GA_ON ?? false;
const gaKey = process.env.REACT_APP_GA_KEY ?? null;

if (gaOn && gaKey) {
  import("react-ga")
    .then((ReactGA) => {
      ReactGA.initialize(gaKey);
      ReactGA.pageview(window.location.pathname + window.location.search);
    })
    .catch((error) => {
      console.error("gaOnError");
    });
}

const ymOn = process.env.REACT_APP_YM_ON ?? false;
const ymKey = process.env.REACT_APP_YM_KEY ?? 0;
const ymWebvisorOn = process.env.REACT_APP_YM_WEBVISOR_ON ?? false;

const ymRezultFull = ymOn && ymOn;

const ymBind = {
  accounts: [],
  options: { defer: true },
};

if (ymRezultFull) {
  ymBind.accounts.push(parseInt(ymKey, 10));
  if (ymWebvisorOn) {
    ymBind.options.webvisor = true;
  }
}

function App() {
  const routes = useRoutes();

  return (
    <div className="root">
      {ymRezultFull && <YMInitializer {...ymBind} />}
      <Router>
        <Layout>{routes}</Layout>
      </Router>
    </div>
  );
}

export default App;
