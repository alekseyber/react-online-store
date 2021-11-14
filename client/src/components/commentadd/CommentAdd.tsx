import { useState, FC } from "react";
import Button from "@mui/material/Button";
import withStyles from '@mui/styles/withStyles';
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AppForm from "../appform/AppForm";
import { COMMENT_ADD_QUERY, ICommentAdd } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import {
  COMMENT_ADD_MUTATION,
  AddCommentMutation,
  AddCommentMutationVar,
  AddCommentMutationInput,
} from "../../graphql/gqlMutation";
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

interface IFormDataInput {
  name: string;
  comment: string;
  recaptchaToken: string;
}

const CommentAdd: FC = () => {
  const [expanded, setExpanded] = useState(false);

  const { data } = useQueryApp<ICommentAdd>(COMMENT_ADD_QUERY);
  const commentStatus = data ? data.commentStatus : false;

  const btnText: string = expanded ? "Скрыть" : "Добавить отзыв";

  const onCompleted = () => {
    commentStatusVar(true);
  };

  const { mutate } = useMutationApp<AddCommentMutation, AddCommentMutationVar>(
    COMMENT_ADD_MUTATION,
    onCompleted
  );

  const handleInputSubmit = (formDataInput: IFormDataInput): void => {
    const fieldsForm = ["name", "comment", "recaptchaToken"];

    const formDataStart = new FormDataClass<IFormDataInput>(
      formDataInput,
      fieldsForm
    );

    const formData: AddCommentMutationInput = {
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
