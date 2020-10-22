import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { showAlert, loadingBtnVar } from "../graphql/localVarsApp";

// const parseError = (error) => {
//   const { graphQLErrors } = error;
//   const rezult = {
//     message: error.message,
//     status: 0,
//   };

//   if (graphQLErrors) {
//     if (graphQLErrors[0]) {
//       const exception = graphQLErrors[0].extensions.exception;
//       if (exception.status) {
//         rezult.status = exception.status;
//       }
//     }
//   }

//   return rezult;
// };

class FormDataClass {
  constructor(formDataInput, fieldsForm) {
    fieldsForm.forEach((field) => {
      this[field] = formDataInput[field] ?? "";
      if (typeof this[field] === "string" && this[field].length) {
        this[field] = this[field].trim();
      }
    });
  }
}

const useMutationApp = (
  MUTATION,
  onCompleted,
  onError,
  ignoreResults,
  variables,
  update
) => {
  const options = {
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

  options.onError = onError
    ? onError
    : (error) => {
        showAlert(error.message, "error");
      };

  const [
    mutate,
    { data: dataMutation, loading: loadingMutation, error: errorMutation },
  ] = useMutation(MUTATION, options);

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
