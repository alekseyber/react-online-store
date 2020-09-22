import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinkUi from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    img: {
        padding: 0,
        '& > img': {
            maxWidth: '40px',
            height: 'auto',
        }

    },
});

const OrderInfPage = ({ data }) => {
    const { currSymbol } = useSelector(state => state.start.paramsData);
    const classes = useStyles()
    const baseUrlApp = useSelector(state => state.start.baseUrl);

    return (
        <Card>
            <CardContent>
                <div className="mb-1">
                    <Typography variant="body1" component="span" color="textSecondary">Дата заказа:</Typography>
                    <Typography variant="body1" component="span" className="ml-1 font-weight-black">
                        {data.orderData}
                    </Typography>
                </div>
                <div className="mb-1">
                    <Typography variant="body1" component="span" color="textSecondary">Город доставки:</Typography>
                    <Typography variant="body1" component="span" className="ml-1 font-weight-black">
                        {data.cityName}
                    </Typography>
                </div>
                <div className="mb-1">
                    <Typography variant="body1" component="span" color="textSecondary">Телефон:</Typography>
                    <Typography variant="body1" component="span" className="ml-1 font-weight-black">
                        {data.phone}
                    </Typography>
                </div>
                <div className="mb-1">
                    <Typography variant="body1" component="span" color="textSecondary">Текущий статус:</Typography>
                    <Typography variant="body1" component="span" className="ml-1 font-weight-black">
                        {data.orderStatus}
                    </Typography>
                </div>
                <div className="mb-2">
                    <Typography variant="body1" component="span" color="textSecondary">Сумма:</Typography>
                    <Typography variant="body1" component="span" className="ml-1 font-weight-black">
                        {data.summa} {currSymbol}
                    </Typography>
                </div>
                <Typography variant="subtitle1" component="h2" gutterBottom className="font-weight-black">Состав заказа:</Typography>
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
                                        <img
                                            alt='img'
                                            src={baseUrlApp + row.img}
                                        />
                                    </TableCell>
                                    {/* component="th" scope="row" */}
                                    <TableCell >
                                        <LinkUi component={Link} to={row.link}>{row.title}</LinkUi>
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

    )
}




OrderInfPage.propTypes = {
    data: PropTypes.object.isRequired,
};

export default OrderInfPage;