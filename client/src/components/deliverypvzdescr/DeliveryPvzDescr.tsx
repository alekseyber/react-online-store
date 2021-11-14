import { FC } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { TPvzSelect } from "../../graphql/localVars";
import { TPvzListItem } from "../../graphql/gqlQuery";

interface DeliveryPvzDescrProps {
  item: TPvzSelect | TPvzListItem;
  selected?: boolean;
  divider_end?: boolean;
}

interface SelectedPvzDescrProps {
  item: TPvzSelect;
  divider_end: boolean;
}

interface ItemPvzDescrProps {
  item: TPvzListItem;
  divider_end: boolean;
}

const SelectedPvzDescr: FC<SelectedPvzDescrProps> = ({ item, divider_end }) => {
  if (!item) {
    return null;
  }
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
};

const ItemPvzDescr: React.FC<ItemPvzDescrProps> = ({ item, divider_end }) => {
  if (!item) {
    return null;
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

const DeliveryPvzDescr: FC<DeliveryPvzDescrProps> = ({
  item,
  selected = false,
  divider_end = false,
}) => {
  if (selected) {
    return (
      <SelectedPvzDescr item={item as TPvzSelect} divider_end={divider_end} />
    );
  }

  return <ItemPvzDescr item={item as TPvzListItem} divider_end={divider_end} />;
};

export default DeliveryPvzDescr;
