import { FC } from "react"; //, { lazy, Suspense }
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "./router/index";
import Layout from "./containers/layout/Layout";
import {
  AnaliticsProvider,
  AnaliticsProviderProps,
} from "./hoc/AnaliticsProvider";

const bindAnalitics: AnaliticsProviderProps = {
  googleAnalitics: null,
  yandexMetrika: null,
};

if (process.env.REACT_APP_GA_ON === "true" && process.env.REACT_APP_GA_KEY) {
  bindAnalitics.googleAnalitics = process.env.REACT_APP_GA_KEY;
}

if (process.env.REACT_APP_YM_ON === "true" && process.env.REACT_APP_YM_KEY) {
  const account: number = parseInt(process.env.REACT_APP_YM_KEY, 10);
  if (account) {
    bindAnalitics.yandexMetrika = account;
  }
}

const App: FC = () => {
  const routes = useRoutes();

  return (
    <div className="root">
      <Router>
        <AnaliticsProvider {...bindAnalitics}>
          <Layout>{routes}</Layout>
        </AnaliticsProvider>
      </Router>
    </div>
  );
};

export default App;
