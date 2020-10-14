import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { useRouter } from "./router.hook";
import { showAlert, setErrorApp, clearErrorApp } from "../redux/actions/app";

const useQueryApp = (
  QUERY,
  variables = {},
  global = false,
  redirect = false
) => {
  const options = {};
  if (Object.keys(variables).length) {
    options.variables = variables;
  }

  const { loading, data, error, refetch } = useQuery(QUERY, options);

  const dispatch = useDispatch();
  const { replace } = useRouter();

  useEffect(() => {
    if (global && error) {
      dispatch(setErrorApp(error, refetch));
    } else if (error) {
      const { graphQLErrors } = error;
      if (redirect && graphQLErrors) {
        if (graphQLErrors[0]) {
          const exception = graphQLErrors[0].extensions.exception;
          if (exception.status === 404) {
            replace("/404");
          } else {
            dispatch(showAlert(error.message, "error"));
          }
        } else {
          dispatch(showAlert(error.message, "error"));
        }
      } else {
        dispatch(showAlert(error.message, "error"));
      }
    }

    return () => {
      dispatch(clearErrorApp());
    };
  }, [dispatch, global, error, redirect, refetch, replace]);

  return {
    loading,
    data,
    error,
  };
};

export { useQueryApp };
