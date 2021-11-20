import { FC, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import TagManager from "react-gtm-module";
import { useRoutes } from "./router/index";
import Layout from "./containers/layout/Layout";

// import {
//   AnaliticsProvider,
//   AnaliticsProviderProps,
// } from "./hoc/AnaliticsProvider";

// const bindAnalitics: AnaliticsProviderProps = {
//   googleAnalitics: null,
//   yandexMetrika: null,
// };

// if (process.env.REACT_APP_GA_ON === "true" && process.env.REACT_APP_GA_KEY) {
//   bindAnalitics.googleAnalitics = process.env.REACT_APP_GA_KEY;
// }

// if (process.env.REACT_APP_YM_ON === "true" && process.env.REACT_APP_YM_KEY) {
//   const account: number = parseInt(process.env.REACT_APP_YM_KEY, 10);
//   if (account) {
//     bindAnalitics.yandexMetrika = account;
//   }
// }

//<AnaliticsProvider {...bindAnalitics}></AnaliticsProvider>

let gtmId: string | undefined = "";
if (process.env.REACT_APP_GTM_ON === "true" && process.env.REACT_APP_GTM_KEY) {
  gtmId = process.env.REACT_APP_GTM_KEY;
}

const App: FC = () => {
  const routes = useRoutes();

  useEffect(() => {
    if (gtmId) {
      TagManager.initialize({ gtmId });
    }
  }, []);

  return (
    <div id="root">
      <BrowserRouter>
        <Layout>{routes}</Layout>
      </BrowserRouter>
    </div>
  );
};

export default App;
