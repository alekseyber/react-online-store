import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "./router.hook";
import { showAlert, setErrorApp, clearErrorApp } from "../graphql/localVarsApp";

const parseError = (error) => {
  const { graphQLErrors } = error;
  const rezult = {
    message: error.message,
    status: 0,
  };

  if (graphQLErrors) {
    if (graphQLErrors[0]) {
      const exception = graphQLErrors[0].extensions.exception;
      if (exception.status) {
        rezult.status = exception.status;
      }
    }
  }

  return rezult;
};

const useQueryApp = (
  QUERY,
  variables = {},
  global = false,
  redirect = false,
  fetchPolicy,
  onCompleted,
  skip = false
) => {
  const options = {};
  if (Object.keys(variables).length) {
    options.variables = variables;
  }

  if (fetchPolicy) {
    options.fetchPolicy = fetchPolicy;
  }

  if (onCompleted) {
    options.onCompleted = onCompleted;
  }

  if (skip) {
    options.skip = true;
  }

  const { loading, data, error, refetch, fetchMore } = useQuery(QUERY, options);

  //const dispatch = useDispatch();
  const { replace } = useRouter();

  useEffect(() => {
    if (global && error) {
      const { status } = parseError(error);
      const text = status === 503 ? error.message : null;
      setErrorApp(refetch, text);
    } else if (error) {
      if (redirect) {
        const { status } = parseError(error);
        if (status === 404) {
          replace("/404");
        } else {
          showAlert(error.message, "error");
        }
      } else {
        showAlert(error.message, "error");
      }
    }

    return () => {
      clearErrorApp();
    };
  }, [global, error, redirect, refetch, replace]);

  return {
    loading,
    data,
    error,
    fetchMore,
  };
};

export { useQueryApp };
