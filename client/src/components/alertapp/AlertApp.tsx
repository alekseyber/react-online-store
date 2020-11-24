import { FC } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { hideAlert } from "../../graphql/localVarsApp";
import { ALERT_QUERY, IAlert } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const AlertApp: FC = () => {
  const { data } = useQueryApp<IAlert>(ALERT_QUERY);

  const alertData = data ? data.alert : null;
  const openOn = data ? !!data.alert : false;
  const alertText = alertData ? alertData.text : "";
  const alertType = alertData ? alertData.type : "success";

  const closeAlertHandler = () => {
    // if (reason === "clickaway") {
    //   return;
    // }
    hideAlert();
  };

  return (
    <Snackbar open={openOn} autoHideDuration={6000} onClose={closeAlertHandler}>
      <Alert
        onClose={closeAlertHandler}
        severity={alertType}
        elevation={6}
        variant="filled"
      >
        {alertText}
      </Alert>
    </Snackbar>
  );
};

export default AlertApp;
