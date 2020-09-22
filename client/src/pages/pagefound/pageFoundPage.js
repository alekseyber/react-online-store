import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { PageBase } from '../../hoc/PageBase';


const useStyles = makeStyles({
    root: {
        maxWidth: 450,
        margin: '0 auto'
    },
});


export default () => {

    const classes = useStyles();
    const baseUrl = useSelector(state => state.start.baseUrl);

    const bind = {
        name_page: 'Страница не найдена',
        action_page: 'Неправильно набран адрес, или такой страницы на сайте больше не существует.',
        link_page: "/404",
        title: 'Страница не найдена',
        filter_on: true,
        //meta_full: true,
        meta_key: 'Страница не найдена',
        //  breadcrumbs_name: 
    }

    return (
        <PageBase {...bind}>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    alt="Страница не найдена"
                    //height="140"
                    image={baseUrl + "/images/404.png"}
                />
                <CardContent>
                    <Typography variant="body1" component="p">
                        Неправильно набран адрес, или такой страницы на сайте больше не существует.
                        </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="secondary" component={Link} to="/" variant="contained">Вернитесь на главную</Button>
                </CardActions>
            </Card>
        </PageBase>
    )
}