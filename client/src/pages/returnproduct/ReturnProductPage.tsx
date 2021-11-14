import { FC } from "react";
import Card from "@mui/material/Card";
import PhoneIcon from "@mui/icons-material/Phone";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { PageBase } from "../../hoc/PageBase";
import { useHtml } from "../../hooks/html.hook";
import AppForm from "../../components/appform/AppForm";
import {
  RETURN_PRODUCT_PAGE_QUERY,
  IReturnProductPage,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
//import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageSceleton from "../../components/skeletons/PageSceleton";
import ContentSceleton from "../../components/skeletons/ContentSceleton";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import {
  RETURN_PRODUCT_MUTATION,
  AddReturnProductMutation,
  AddReturnProductMutationVar,
  ReturnProductMutationInput,
} from "../../graphql/gqlMutation";
import {
  FormDataClass,
  useMutationApp,
} from "../../hooks/appolloMutationApp.hook";
import { returnProductStatusVar } from "../../graphql/localVarsOrder";

const ReturnProductPage: FC = () => {
  const { data, loading, error } = useQueryApp<IReturnProductPage>(
    RETURN_PRODUCT_PAGE_QUERY
  );

  const returnProductStatus = data ? data.returnProductStatus : null;
  const textReturnProduct = data ? data.textReturnProduct.content : "";

  const contentReact = useHtml(textReturnProduct);

  const onCompleted = (inputData: AddReturnProductMutation) => {
    returnProductStatusVar(inputData.addReturnProduct.message);
  };

  const { mutate } = useMutationApp<
    AddReturnProductMutation,
    AddReturnProductMutationVar
  >(RETURN_PRODUCT_MUTATION, onCompleted);

  const handleInputSubmit = (formDataInput: ReturnProductMutationInput) => {
    const fieldsForm = ["action", "phone", "recaptchaToken"];

    const formData = new FormDataClass<ReturnProductMutationInput>(
      formDataInput,
      fieldsForm
    ) as ReturnProductMutationInput;

    mutate({ variables: { formData } });
  };

  if (loading)
    return (
      <PageSceleton title={true}>
        <ContentSceleton />
      </PageSceleton>
    );
  if (error) return <ErrorContent />;

  if (!data) {
    return <ErrorContent />;
  }

  const { phone } = data.paramsData;

  const bind = {
    name_page: "Возврат/обмен",
    action_page: "Отправить заявку на возврат/обмен",
    link_page: "/returnproduct",
    title: "Отправить заявку на возврат/обмен",
    filter_on: true,
  };
  const bindForm = {
    handleInputSubmit,
    ofertaOn: false,
    commentOn: false,
    btnText: "Отправить заявку",
    returnproduct: true,
    fullOrder: false,
    reOn: true,
  };

  return (
    <PageBase {...bind}>
      <Card>
        <CardContent>
          {returnProductStatus && (
            <>
              <Typography variant="h6" component="h2">
                {returnProductStatus}
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Благодарим Вас за обращение на нашем сайте. В ближайшее время с
                Вами свяжется менеджер для уточнения деталей.
              </Typography>
            </>
          )}
          {!returnProductStatus && <AppForm {...bindForm} />}
          <Divider className="mt-2" />
          {contentReact}
          <Typography variant="body1" component="p">
            Для оформления заказа, просим заполнить форму, размещенную выше,
            либо позвонить по телефону:{" "}
            <Button
              startIcon={<PhoneIcon />}
              className="ml-1"
              href={"tel:" + phone.href}
            >
              {phone.title}
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </PageBase>
  );
};

export default ReturnProductPage;
