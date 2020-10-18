import { makeVar } from "@apollo/client";

//export const loadingFormVar = makeVar(false);
export const alertVar = makeVar(null);
export const recentlyViewedVar = makeVar([]);
export const errorVar = makeVar(null);

//import { showAlert, setLoadingForm } from "../redux/actions/app";

// const initialState = {

//   loadingForm: false,
//   alertType: "success",
//   alertText: "",
//   alertVisible: false,

//   recentlyViewed: [],
//   error: null,
// };

export const hideAlert = () => {
  alertVar(null);
};

export const showAlert = (text, type = "success") => {
  alertVar({ type, text });

  setTimeout(() => {
    const alert = alertVar();
    if (alert) {
      alertVar(null);
    }
  }, 2500);
};



export const addRecentlyViewed = (alias) => {
  const recentlyViewed = recentlyViewedVar();
  if (recentlyViewed.indexOf(alias) === -1) {
    recentlyViewedVar([alias, ...recentlyViewed]);
  }
};

export const setErrorApp = (func, textInput) => {
  const title = "Ой, что-то пошло не так...";
  const text = textInput || "Проверьте интернет и попробуйте еще раз...";

  errorVar({ title, text, func });
};

export const clearErrorApp = () => {
  errorVar(null);
};




// export const setLoadingForm = (loading = true) => {
//   return {
//     type: SET_LOADING_FORM,
//     payload: loading,
//   };
// };