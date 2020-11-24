import { FC } from "react"; //, { lazy, Suspense }
import { YMInitializer } from "react-yandex-metrika";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "./router/index";
import Layout from "./containers/layout/Layout";

const gaOn: boolean = process.env.REACT_APP_GA_ON === "true" ? true : false;
const gaKey: string = process.env.REACT_APP_GA_KEY || "";

if (gaOn && gaKey) {
  import("react-ga")
    .then((ReactGA) => {
      ReactGA.initialize(gaKey);
      ReactGA.pageview(window.location.pathname + window.location.search);
    })
    .catch(() => {
      console.error("gaOnError");
    });
}

const ymOn: boolean = process.env.REACT_APP_YM_ON === "true" ? true : false;
const ymKey: string = process.env.REACT_APP_YM_KEY || "";
const ymWebvisorOn: boolean =
  process.env.REACT_APP_YM_WEBVISOR_ON === "true" ? true : false;

const ymRezultFull: boolean = ymOn && ymOn;

type YmBind = {
  accounts: number[];
  options: {
    defer: boolean;
    webvisor?: boolean;
  };
};

const ymBind: YmBind = {
  accounts: [],
  options: { defer: true },
};

if (ymRezultFull) {
  const account: number = parseInt(ymKey, 10);
  ymBind.accounts.push(account);
  if (ymWebvisorOn) {
    ymBind.options.webvisor = true;
  }
}

const App: FC = () => {
  const routes = useRoutes();

  return (
    <div className="root">
      {ymRezultFull && <YMInitializer {...ymBind} />}
      <Router>
        <Layout>{routes}</Layout>
      </Router>
    </div>
  );
};

export default App;
