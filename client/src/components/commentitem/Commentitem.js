import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { indigo } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import HtmlText from '../htmltext/HtmlText';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    indigo: {
        color: theme.palette.getContrastText(indigo[500]),
        backgroundColor: indigo[500],
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    commentText: {
        marginTop: theme.spacing(2),
    },
    commentAnswer: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(3),
    }
}));


const CommentItem = ({ item }) => {
    const classes = useStyles();

    const Contetnt = () => {

        if (!item.htmlstatus) {
            return <Typography component='p' variant="body1">{item.commenText}</Typography>
        }
        return <Typography component='div' variant="body1"><HtmlText text={item.commenText} /></Typography>
    }

    return (
        <Grid item xs={12}>
            <Card className={classes.root}>
                <CardContent>
                    <div className={classes.title}>
                        <Avatar className={classes.indigo}>
                            <AccountCircleIcon />
                        </Avatar>
                        <Typography component='div' variant="h6" className="ml-2">{item.authorName}</Typography>
                    </div>
                    <Typography component='p' variant="body2" color="textSecondary">{item.date}</Typography>
                    <div className={classes.commentText}>
                        <Contetnt />
                    </div>
                    {item.answer && <div className={classes.commentAnswer}>
                        <Typography component='div' variant="body1" color="textSecondary">Ответ магазина:</Typography>
                        <Typography component='div' variant="body1"><HtmlText text={item.answer} /></Typography>
                    </div>}
                </CardContent>
            </Card>
        </Grid>
    )

}


CommentItem.propTypes = {
    item: PropTypes.object.isRequired,
};


export default CommentItem;