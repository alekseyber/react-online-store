import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { hideAlert } from "../../graphql/localVarsApp";
import { ALERT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default () => {
  const { data } = useQueryApp(ALERT_QUERY);

  const alertData = data ? data.alert : null;
  const openOn = data ? !!data.alert : false;
  const alertText = alertData ? alertData.text : "";
  const alertType = alertData ? alertData.type : "success";

  const closeAlertHandler = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideAlert();
  };

  return (
    <Snackbar open={openOn} autoHideDuration={6000} onClose={closeAlertHandler}>
      <Alert onClose={closeAlertHandler} severity={alertType || "success"}>
        {alertText}
      </Alert>
    </Snackbar>
  );
};
