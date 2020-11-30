import { useEffect, FC, createContext, useMemo } from "react";
//import ReactPixel from "react-facebook-pixel";
import ya, { YMInitializer } from "react-yandex-metrika";
import ReactGA from "react-ga";

export interface IreachGoalData {
  currency?: string;
  order_price?: number;
  value?: number | undefined;
}

export interface AnaliticsProviderProps {
  googleAnalitics?: string | null;
  yandexMetrika?: number | null;
}

export interface IAnaliticsContext extends AnaliticsProviderProps {
  trigger: (action: string, data: IreachGoalData) => void;
  gaAddPage: (pathname: string) => void;
  userId: string | undefined;
}

const generateUserId = () => {
  const chr4 = () => Math.random().toString(16).slice(-4);
  return (
    chr4() +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    chr4() +
    chr4()
  );
};

export const ContextAnalitics = createContext<IAnaliticsContext>({
  //facebookPixel: null,
  googleAnalitics: null,
  yandexMetrika: null,
  trigger: () => {},
  gaAddPage: () => {},
  userId: undefined,
});

export const AnaliticsProvider: FC<AnaliticsProviderProps> = ({
  //facebookPixel = null,
  googleAnalitics = null,
  yandexMetrika = null,
  children,
}) => {
  const userId = useMemo<string | undefined>(() => {
    if (!localStorage.getItem("_analiticsUserId")) {
      localStorage.setItem("_analiticsUserId", generateUserId());
    }

    const userIdCandidat = localStorage.getItem("_analiticsUserId");
    if (userIdCandidat) {
      return userIdCandidat;
    }
    return undefined;
  }, []);

  const content = (
    <ContextAnalitics.Provider
      value={{
        // facebookPixel,
        googleAnalitics,
        yandexMetrika,
        trigger: (action: string, data: IreachGoalData = {}) => {
          try {
            if (googleAnalitics)
              ReactGA.event({
                category: "actions",
                action,
                value: data ? data.value : undefined,
              });
            if (yandexMetrika) ya("reachGoal", action, data);
            //  if (facebookPixel) ReactPixel.trackCustom(action, data);
          } catch (error) {
            console.error(error);
          }
        },
        gaAddPage: (pathname: string) => {
          try {
            if (googleAnalitics) {
              ReactGA.set({ page: pathname });
              ReactGA.pageview(pathname);
            }
          } catch (error) {
            console.error(error);
          }
        },
        userId,
      }}
    >
      {children}
    </ContextAnalitics.Provider>
  );

  useEffect(() => {
    if (googleAnalitics) {
      // if (facebookPixel) {
      //   const facebookPixelAdvancedMatching = {
      //     userId: localStorage.getItem("_analiticsUserId")
      //   };
      //   ReactPixel.init(facebookPixel, facebookPixelAdvancedMatching, {
      //     autoConfig: true,
      //     debug: false
      //   });
      // }

      ReactGA.initialize(googleAnalitics, {
        gaOptions: {
          userId,
        },
      });
    }
  }, [googleAnalitics, userId]);

  if (!yandexMetrika) {
    return content;
  }

  return (
    <>
      <YMInitializer
        accounts={[yandexMetrika]}
        options={{
          // clickmap: true,
          // trackLinks: true,
          // accurateTrackBounce: true,
          webvisor: true,
          //   trackHash: true,
          userParams: {
            userId,
          },
        }}
        version="2"
      />
      {content}
    </>
  );
};
