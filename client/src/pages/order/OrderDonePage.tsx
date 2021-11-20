import { useEffect, useMemo, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinkUi from "@mui/material/Link";
import Button from "@mui/material/Button";
import { PageBase } from "../../hoc/PageBase";
import { showAlert } from "../../graphql/localVarsApp";
import { ORDER_DONE_PAGE_QUERY, IOrderDonePage } from "../../graphql/gqlQuery";
import { orderDoneVar } from "../../graphql/localVarsOrder";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { ContextAnalitics, IreachGoalData } from "../../hoc/AnaliticsProvider";

const useStyles = makeStyles({
  root: {
    minHeight: "30vh",
  },
  imgwr: {
    textAlign: "center",
    marginTop: 10,
    "& > img": {
      width: "auto",
      maxWidth: "100%",
      height: "auto",
    },
  },
});

const OrderDonePage: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate(); 
  const { trigger } = useContext(ContextAnalitics);

  const copyHandler = () => {
    showAlert("Ссылка скопирована");
  };

  const { data, loading, error } = useQueryApp<IOrderDonePage>(
    ORDER_DONE_PAGE_QUERY
  );

  const orderDone = data ? data.orderDone : null;

  useEffect(() => {
    if (!orderDone && !loading) {
      navigate("/404", { replace: true });      
    }
    return () => {
      if (orderDone) {
        orderDoneVar(null);
      }
    };
  }, [navigate, loading, orderDone]);

  const { orderDoneText, baseUrl, baseApiUrl, currSymbol } = useMemo(() => {
    const rezult = {
      orderDoneText: "",
      baseUrl: "",
      baseApiUrl: "",
      currSymbol: "",
    };
    if (data) {
      rezult.orderDoneText = data.paramsData.orderDoneText;
      rezult.baseUrl = data.paramsData.baseUrl;
      rezult.baseApiUrl = data.baseApiUrl;
      rezult.currSymbol = data.paramsData.currSymbol;
    }

    return rezult;
  }, [data]);

  const orderSumma = orderDone ? orderDone.summa : 0;

  useEffect(() => {
    if (orderSumma && trigger) {
      const triggerData: IreachGoalData = {
        currency: currSymbol,
        order_price: orderSumma,
        value: orderSumma,
      };
      trigger("Order received", triggerData);
    }
  }, [orderSumma, currSymbol, trigger]);

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

  const orderId = orderDone ? orderDone.orderId : "";
  const orderNumber = orderDone ? orderDone.orderNumber : "";
  const linkOrder = `/order/${orderId}`;

  // const { orderDoneText, baseUrl } = data.paramsData;
  // const baseApiUrl = data.baseApiUrl;
  const bind = {
    name_page: "Заказ получен",
    action_page: "Заказ получен",
    link_page: "/order/done",
    title: `Заказ № ${orderNumber} получен.`,
    filter_on: false,
  };

  return (
    <PageBase {...bind}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {orderDoneText}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Отслеживать состояние заказа Вы сможете по{" "}
            <LinkUi
              className="font-weight-black"
              component={Link}
              variant="body1"
              to={linkOrder}
            >
              ссылке
            </LinkUi>
            .
          </Typography>
          <CopyToClipboard text={baseUrl + linkOrder} onCopy={copyHandler}>
            <Button variant="contained" size="small" className="mt-2">
              Копировать ссылку
            </Button>
          </CopyToClipboard>
          <div className={classes.imgwr}>
            <img
              alt={bind.title}
              src={`${baseApiUrl}/static/images/rabbit.png`}
              title={bind.title}
            />
          </div>
        </CardContent>
      </Card>
    </PageBase>
  );
};

export default OrderDonePage;
