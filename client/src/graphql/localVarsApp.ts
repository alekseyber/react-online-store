import { makeVar } from "@apollo/client";

export type TLoadingBtn = boolean;

export const loadingBtnVar = makeVar<TLoadingBtn>(false);

type TAlertType = "error" | "info" | "success" | "warning";

interface IAlert {
  text: string;
  type: TAlertType;
}

export type TAlert = null | IAlert;

export const alertVar = makeVar<TAlert>(null);

export type TRecentlyViewed = string[];
export const recentlyViewedVar = makeVar<TRecentlyViewed>([]);

interface IError {
  text: string;
  title: string;
  func: any;
}

export type TError = null | IError;

export const errorVar = makeVar<TError>(null);

export const hideAlert = (): void => {
  alertVar(null);
};

export const showAlert = (text: string, type: TAlertType = "success"): void => {
  alertVar({ type, text });

  setTimeout(() => {
    const alert = alertVar();
    if (alert) {
      alertVar(null);
    }
  }, 2500);
};

export const addRecentlyViewed = (alias: string): void => {
  const recentlyViewed = recentlyViewedVar();
  if (recentlyViewed.indexOf(alias) === -1) {
    recentlyViewedVar([alias, ...recentlyViewed]);
  }
};

export const setErrorApp = (
  func: (variables?: any) => any | null,
  textInput: string | null
): void => {
  const title = "Ой, что-то пошло не так...";
  const text = textInput || "Проверьте интернет и попробуйте еще раз...";

  errorVar({ title, text, func });
};

export const clearErrorApp = (): void => {
  errorVar(null);
};
