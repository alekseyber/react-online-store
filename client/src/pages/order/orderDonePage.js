import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import LinkUi from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import { PageBase } from "../../hoc/PageBase";
import { useRouter } from "../../hooks/router.hook";
import { setOrderValue } from "../../redux/actions/order";
import { showAlert } from "../../redux/actions/app";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ORDER_DONE_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import ErrorContent from "../../components/errorcontent/ErrorContent";

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

export default () => {
  const classes = useStyles();
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const { orderDone, orderId, orderNumber } = useSelector(
    (state) => state.order
  );

  const { data, loading, error } = useQueryApp(ORDER_DONE_PAGE_QUERY);

  const baseUrlApp = useSelector((state) => state.start.baseUrl);
  const linkOrder = `/order/${orderId}`;

  const copyHandler = () => {
    dispatch(showAlert("Ссылка скопирована"));
  };

  useEffect(() => {
    if (!orderDone) {
      replace("/404");
    }

    return () => {
      dispatch(setOrderValue("orderDone", false));
    };
  }, [dispatch, orderDone, replace]);

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

  const { orderDoneText, baseUrl } = data.paramsData;

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
              src={`${baseUrlApp}/images/rabbit.png`}
              title={bind.title}
            />
          </div>
        </CardContent>
      </Card>
    </PageBase>
  );
};
