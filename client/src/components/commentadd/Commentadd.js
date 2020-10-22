import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AppForm from "../appform/AppForm";
import { COMMENT_ADD_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { COMMENT_ADD_MUTATION } from "../../graphql/gqlMutation";
import {
  FormDataClass,
  useMutationApp,
} from "../../hooks/appolloMutationApp.hook";
import { commentStatusVar } from "../../graphql/localVarsOrder";

const Accordion = withStyles((theme) => ({
  root: {
    border: "none",
    boxShadow: "none",
    marginBottom: theme.spacing(2),
  },
}))(MuiAccordion);

const AccordionDetails = withStyles({
  root: {
    display: "block",
  },
})(MuiAccordionDetails);

const CommentAdd = () => {
  const [expanded, setExpanded] = useState(false);

  const { data } = useQueryApp(COMMENT_ADD_QUERY);
  const commentStatus = data ? data.commentStatus : false;

  const btnText = expanded ? "Скрыть" : "Добавить отзыв";

  const onCompleted = () => {
    commentStatusVar(true);
  };

  const { mutate } = useMutationApp(COMMENT_ADD_MUTATION, onCompleted);

  const handleInputSubmit = (formDataInput) => {
    const fieldsForm = ["name", "comment", "recaptchaToken"];

    const formDataStart = new FormDataClass(formDataInput, fieldsForm);

    const formData = {
      authorName: formDataStart.name,
      commenText: formDataStart.comment,
      recaptchaToken: formDataStart.recaptchaToken,
    };
    mutate({ variables: { formData } });
  };

  const bindForm = {
    handleInputSubmit,
    ofertaOn: false,
    commentAdd: true,
    btnText: "Отправить",
    fullOrder: false,
    reOn: true,
  };

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {btnText}
        </Button>
      </AccordionSummary>
      <AccordionDetails>
        <Card>
          <CardContent>
            {!commentStatus && (
              <>
                <Typography
                  component="h2"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  Ваш отзыв
                </Typography>
                <AppForm {...bindForm} />
              </>
            )}
            {commentStatus && (
              <>
                <Typography
                  component="h2"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  Ваш отзыв получен
                </Typography>
                <Typography component="p" variant="body1" align="center">
                  В ближайшее время он появится в этом разделе
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

export default CommentAdd;
