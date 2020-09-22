import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const DeliveryPvzDescr = ({ item, selected, divider_end }) => {


    return (


        <>
            {
                selected && <div>
                    <Typography variant="body2" component="div" className="font-weight-black">{item.Name}</Typography>
                    <Typography variant="body2" component="div" color="textSecondary">{item.Address}</Typography>
                </div>
            }
            <div>
                <Typography variant="body2" component="div" className="font-weight-black">График работы:</Typography>
                <Typography variant="body2" component="div" color="textSecondary">{item.WorkTime}</Typography>
            </div>
            {
                item.Phone && <div>
                    <Typography variant="body2" component="div" className="font-weight-black">Телефон:</Typography>
                    <Typography variant="body2" component="div" color="textSecondary">{item.Phone}</Typography>
                </div>
            }
            {
                item.NearestStation && <div>
                    <Typography variant="body2" component="div" className="font-weight-black">Как проехать:</Typography>
                    <Typography variant="body2" component="div" color="textSecondary">{item.NearestStation}</Typography>
                </div>
            }
            {item.Note && <Typography variant="caption" component="div" color="textSecondary">{item.Note}</Typography>}
            {divider_end && <Divider />}

        </>

    )
}

DeliveryPvzDescr.defaultProps = {
    selected: false,
    divider_end: false

};

DeliveryPvzDescr.propTypes = {
    selected: PropTypes.bool,
    item: PropTypes.object.isRequired,
    divider_end: PropTypes.bool,


};

export default DeliveryPvzDescr;