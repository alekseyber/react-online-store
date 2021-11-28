import { FC } from "react";
import { Link } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinkUi from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TOrder } from "../../graphql/gqlQuery";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  img: {
    padding: 0,
    "& > img": {
      maxWidth: "40px",
      height: "auto",
    },
  },
});

interface OrderInfPageProps {
  data: TOrder;
  currSymbol: string;
  baseApiUrl: string;
}

const OrderInfPage: FC<OrderInfPageProps> = ({
  data,
  currSymbol,
  baseApiUrl,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <div className="mb-1">
          <Typography variant="body1" component="span" color="textSecondary">
            Дата заказа:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            className="ml-1 font-weight-black"
          >
            {data.orderData}
          </Typography>
        </div>
        <div className="mb-1">
          <Typography variant="body1" component="span" color="textSecondary">
            Город доставки:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            className="ml-1 font-weight-black"
          >
            {data.cityName}
          </Typography>
        </div>
        <div className="mb-1">
          <Typography variant="body1" component="span" color="textSecondary">
            Телефон:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            className="ml-1 font-weight-black"
          >
            {data.phone}
          </Typography>
        </div>
        <div className="mb-1">
          <Typography variant="body1" component="span" color="textSecondary">
            Текущий статус:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            className="ml-1 font-weight-black"
          >
            {data.orderStatus}
          </Typography>
        </div>
        <div className="mb-2">
          <Typography variant="body1" component="span" color="textSecondary">
            Сумма:
          </Typography>
          <Typography
            variant="body1"
            component="span"
            className="ml-1 font-weight-black"
          >
            {data.summa} {currSymbol}
          </Typography>
        </div>
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          className="font-weight-black"
        >
          Состав заказа:
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Фото</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Цена, {currSymbol}</TableCell>
                <TableCell>Кол-во</TableCell>
                <TableCell>Сумма, {currSymbol}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.cart.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="center" className={classes.img}>
                    <img alt="img" src={baseApiUrl + row.img} />
                  </TableCell>
                  
                  <TableCell>
                    <LinkUi component={Link} to={row.link}>
                      {row.title}
                    </LinkUi>
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  <TableCell>{row.itemSumm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default OrderInfPage;
