import { useEffect } from "react";
import {
  useMutation,
  OperationVariables,
  DocumentNode,
  DataProxy,
  FetchResult,
  MutationHookOptions,
  ApolloError,
} from "@apollo/client";
import { showAlert, loadingBtnVar } from "../graphql/localVarsApp";

class FormDataClass<T extends object> {
  [field: string]: any;

  constructor(formDataInput: T, fieldsForm: string[]) {
    fieldsForm.forEach((field) => {
      if (formDataInput[field as keyof T]) {
        const item = formDataInput[field as keyof T] as unknown;
        if (typeof item === "string") {
          this[field] = (item as string).trim();
        }
        if (typeof item === "number") {
          this[field] = item as number;
        }
        if (typeof item === "boolean") {
          this[field] = item as boolean;
        }
      } else {
        this[field] = "";
      }
    });
  }
}

const useMutationApp = <TData = any, TVariables = OperationVariables>(
  MUTATION: DocumentNode,
  onCompleted: (data: TData) => void | null,
  onError?: (error: ApolloError) => void | null,
  ignoreResults?: boolean,
  variables?: TVariables,
  update?: (cache: DataProxy, mutationResult: FetchResult) => void | null
) => {
  const options: MutationHookOptions<TData, TVariables> = {
    ignoreResults: true,
  };

  if (onCompleted) {
    options.onCompleted = onCompleted;
  }

  if (ignoreResults) {
    options.ignoreResults = false;
  }

  if (variables) {
    options.variables = variables;
  }
  if (update) {
    options.update = update;
  }

  if (onError) {
    options.onError = onError;
  } else {
    options.onError = (error: ApolloError): void => {
      showAlert(error.message, "error");
    };
  }

  // options.onError = onError
  //   ? onError
  //   : (error: ApolloError): void => {
  //       showAlert(error.message, "error");
  //     };

  const [
    mutate,
    { data: dataMutation, loading: loadingMutation, error: errorMutation },
  ] = useMutation<TData, TVariables>(MUTATION, options);

  useEffect(() => {
    loadingBtnVar(loadingMutation);
    return () => {
      loadingBtnVar(false);
    };
  }, [loadingMutation]);

  return {
    dataMutation,
    loadingMutation,
    errorMutation,
    mutate,
  };
};

export { useMutationApp, FormDataClass };
