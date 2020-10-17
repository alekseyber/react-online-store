import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const DeliveryPvzDescr = ({ item, selected, divider_end }) => {
  if (selected) {
    return (
      <>
        <div>
          <Typography
            variant="body2"
            component="div"
            className="font-weight-black"
          >
            {item.Name}
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            {item.Address}
          </Typography>
        </div>

        <div>
          <Typography
            variant="body2"
            component="div"
            className="font-weight-black"
          >
            График работы:
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            {item.WorkTime}
          </Typography>
        </div>

        <div>
          <Typography
            variant="body2"
            component="div"
            className="font-weight-black"
          >
            Информация:
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            {item.AddressComment}
          </Typography>
        </div>

        {divider_end && <Divider />}
      </>
    );
  }

  return (
    <>
      <div>
        <Typography
          variant="body2"
          component="div"
          className="font-weight-black"
        >
          График работы:
        </Typography>
        <Typography variant="body2" component="div" color="textSecondary">
          {item.work_time}
        </Typography>
      </div>
      {item.phones && (
        <div>
          <Typography
            variant="body2"
            component="div"
            className="font-weight-black"
          >
            Телефон:
          </Typography>
          {item.phones.map((phone, i) => (
            <Typography
              variant="body2"
              component="div"
              color="textSecondary"
              key={i}
            >
              {phone.number}
            </Typography>
          ))}
        </div>
      )}
      {item.nearest_station && (
        <div>
          <Typography
            variant="body2"
            component="div"
            className="font-weight-black"
          >
            Информация:
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            {item.nearest_station}
          </Typography>
        </div>
      )}
      {divider_end && <Divider />}
    </>
  );
};

DeliveryPvzDescr.defaultProps = {
  selected: false,
  divider_end: false,
};

DeliveryPvzDescr.propTypes = {
  selected: PropTypes.bool,
  item: PropTypes.object.isRequired,
  divider_end: PropTypes.bool,
};

export default DeliveryPvzDescr;
