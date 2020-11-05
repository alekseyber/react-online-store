import React from "react";
//import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import AppForm from "../../../components/appform/AppForm";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import { IReturnCall, RETURN_CALL_QUERY } from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";
import {
  AddReturnCallMutation,
  AddReturnCallMutationVar,
  ReturnCallMutationInput,
  RETURN_CALL_MUTATION,
} from "../../../graphql/gqlMutation";
import {
  FormDataClass,
  useMutationApp,
} from "../../../hooks/appolloMutationApp.hook";
import { returnCallStatusVar } from "../../../graphql/localVarsOrder";

const ReturnCall: React.FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
  const { data } = useQueryApp<IReturnCall>(RETURN_CALL_QUERY);
  const returnCallStatus = data ? data.returnCallStatus : false;

  const onCompleted = () => {
    returnCallStatusVar(true);
  };

  const { mutate } = useMutationApp<
    AddReturnCallMutation,
    AddReturnCallMutationVar
  >(RETURN_CALL_MUTATION, onCompleted);

  const handleInputSubmit = (formDataInput: ReturnCallMutationInput) => {
    const fieldsForm = ["name", "phone", "comment", "recaptchaToken"];
    const formData = new FormDataClass<ReturnCallMutationInput>(
      formDataInput,
      fieldsForm
    ) as ReturnCallMutationInput;
    mutate({ variables: { formData } });
  };

  return (
    <ModalBase
      handleClose={handleClose}
      title="Задать вопрос или заказать звонок"
      actionsBtnText="Продолжить покупки"
    >
      <>
        {!returnCallStatus && (
          <AppForm
            handleInputSubmit={handleInputSubmit}
            fullOrder={false}
            btnText="Отправить"
            reOn={true}
          />
        )}
        {returnCallStatus && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Ваша заявка успешно получена.
            </Typography>
            <Typography variant="body1" component="p">
              Благодарим Вас за обращение на нашем сайте. В ближайшее время с
              Вами свяжется менеджер.
            </Typography>
          </>
        )}
      </>
    </ModalBase>
  );
};

// ReturnCall.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default ReturnCall;
