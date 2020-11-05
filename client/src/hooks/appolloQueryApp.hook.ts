import { useEffect } from "react";
import {
  useQuery,
  OperationVariables,
  DocumentNode,
  FetchPolicy,
  QueryHookOptions,
  ApolloError,
} from "@apollo/client";
import { useRouter } from "./router.hook";
import { showAlert, setErrorApp, clearErrorApp } from "../graphql/localVarsApp";

interface IErrorResponse {
  message: string;
  status: number;
}

const parseError = (error: ApolloError): IErrorResponse => {
  const { graphQLErrors } = error;
  const rezult: IErrorResponse = {
    message: error.message,
    status: 0,
  };

  if (graphQLErrors) {
    if (graphQLErrors[0]) {
      if (graphQLErrors[0].extensions) {
        const exception = graphQLErrors[0].extensions.exception;
        if (exception.status) {
          rezult.status = exception.status;
        }
      }
    }
  }

  return rezult;
};

const useQueryApp = <TData = any, TVariables = OperationVariables>(
  QUERY: DocumentNode,
  variables: TVariables | null = null,
  global: boolean = false,
  redirect: boolean = false,
  fetchPolicy: FetchPolicy | null = null,
  onCompleted: ((data: TData) => void) | null = null, // | {}
  skip: boolean = false
) => {
  const options: QueryHookOptions<TData, TVariables> = {};

  // if (Object.keys(variables).length) {
  //   options.variables = variables;
  // }

  if (variables) {
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

  const { loading, data, error, refetch, fetchMore } = useQuery<
    TData,
    TVariables
  >(QUERY, options);

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
