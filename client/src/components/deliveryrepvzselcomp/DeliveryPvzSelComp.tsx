import {
  useState,
  useCallback,
  FC,
  TouchEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import Box from "@material-ui/core/Box";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LinearProgress from "@material-ui/core/LinearProgress";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import DeliveryPvzDescr from "../deliverypvzdescr/DeliveryPvzDescr";
import { pvzSelectVar, TPvzSelect } from "../../graphql/localVars";
import {
  DELIVERY_PVZ_SEL_COMP_QUERY,
  IDeliveryPvzSelector,
  IDeliveryPvzSelComp,
  TPvzListItem,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "60vw",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  list: {
    width: "100%",
    maxWidth: 400,
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  loader: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    marginBottom: theme.spacing(2),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
}));

interface ListItemPvzBaseProps {
  handleSetPvz: (item: TPvzListItem, index: number) => void;
  pvzSelect: TPvzSelect;
}

interface ListItemPvzProps extends ListItemPvzBaseProps {
  index: number;
  item: TPvzListItem;
}

const ListItemPvz: FC<ListItemPvzProps> = ({
  item,
  pvzSelect,
  index,
  handleSetPvz,
}) => {
  const classes = useStyles();

  const handleClick = () => {
    setOpen(!open);
  };

  let selected = false;
  if (pvzSelect) {
    selected = item.code === pvzSelect.Code;
  }

  const [open, setOpen] = useState(selected);

  const btnTitle = selected ? "Выбрано" : "Выбрать";

  const primaryEl = (
    <>
      <DeliveryPvzDescr item={item as TPvzListItem} />
      <Button
        onClick={() => handleSetPvz(item, index)}
        variant="contained"
        color="primary"
        size="small"
        disabled={selected}
      >
        {btnTitle}
      </Button>
    </>
  );
  return (
    <>
      <Divider component="li" />
      <ListItem dense button>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="div"
              className="font-weight-black"
            >
              {item.name}
            </Typography>
          }
          secondary={item.location.address}
          onClick={handleClick}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem className={classes.nested} divider dense>
            <ListItemText primary={primaryEl} disableTypography={true} />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

const MapItemPvz: FC<ListItemPvzProps> = ({
  item,
  handleSetPvz,
  index,
  pvzSelect,
}) => {
  let selected = false;
  if (pvzSelect) {
    selected = item.code === pvzSelect.Code;
  }

  const options = {
    preset: "islands#blueIcon",
  };

  if (selected) {
    options.preset = "islands#blackDotIcon";
  }

  const coordinates = [item.location.latitude, item.location.longitude];

  // const properties = {
  //     hintContent: `<strong>${item.$.Name}</strong><br>${item.$.Address}`,
  //     balloonContentHeader: "Выбран ПВЗ:",
  //     balloonContentBody: item.$.Address,
  // };

  return (
    <Placemark
      geometry={coordinates}
      options={options}
      onClick={() => handleSetPvz(item, index)}
    />
  );
};

interface MapPvzProps extends ListItemPvzBaseProps {
  yaMapKey: string;
  pvz: TPvzListItem[];
}

interface YMapsProps {
  lang?: "ru_RU" | "tr_TR" | "en_US" | "en_RU" | "ru_UA" | "uk_UA" | undefined;
  apikey?: string | undefined;
  coordorder?: "latlong" | "longlat" | undefined;
}

const MapPvz: FC<MapPvzProps> = ({
  pvz,
  pvzSelect,
  handleSetPvz,
  yaMapKey,
}) => {
  const classes = useStyles();
  const [load, setLoad] = useState(true);

  const query: YMapsProps = {
    lang: "ru_RU",
    coordorder: "latlong",
    apikey: yaMapKey,
  };
  const center = [pvz[0].location.latitude, pvz[0].location.longitude];
  const mapData = {
    center,
    zoom: 11,
    controls: ["geolocationControl", "fullscreenControl", "zoomControl"],
  };
  const modules = [
    "control.GeolocationControl",
    "control.FullscreenControl",
    "control.ZoomControl",
  ];

  return (
    <YMaps query={query}>
      {load && (
        <div className={classes.loader}>
          <Typography
            variant="subtitle2"
            component="div"
            align="center"
            gutterBottom
          >
            Загружаем карту ПВЗ...
          </Typography>
          <LinearProgress color="primary" />
        </div>
      )}
      <Map
        defaultState={mapData}
        modules={modules}
        width="100%"
        height="60vh"
        onLoad={() => setLoad(false)}
      >
        {pvz.map((itemPvz, i) => (
          <MapItemPvz
            item={itemPvz}
            key={i}
            index={i}
            pvzSelect={pvzSelect}
            handleSetPvz={handleSetPvz}
          />
        ))}
      </Map>
    </YMaps>
  );
};

const greatItem = (
  item: TPvzListItem,
  index: number,
  cityid: number
): TPvzSelect => {
  const rezult: TPvzSelect = {
    index,
    cityid,
    Code: item.code,
    Name: item.name,
    Address: "",
    WorkTime: item.work_time,
    AddressComment: item.nearest_station,
    type: item.type,
  };

  if (item.location.address) {
    rezult.Address = item.location.address;
  }
  return rezult;
};

const handleSetPvzFunc = (
  cityid: number,
  item: TPvzListItem,
  index: number
) => {
  const selectedPvzValue = greatItem(item, index, cityid);
  pvzSelectVar(selectedPvzValue);
};

interface DeliveryPvzSelCompProps {
  dataInput: IDeliveryPvzSelector;
}

const DeliveryPvzSelComp: FC<DeliveryPvzSelCompProps> = ({ dataInput }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { data } = useQueryApp<IDeliveryPvzSelComp>(
    DELIVERY_PVZ_SEL_COMP_QUERY
  );
  const pvzSelect = data ? data.pvzSelect : null;
  const pvz = dataInput.getPvz.list;
  const cityid = dataInput.cityIdCurrent;
  const yaMapKey = dataInput.yaMapKey;

  const handleSetPvz = useCallback(
    (item: TPvzListItem, index: number) => {
      handleSetPvzFunc(cityid, item, index);
    },
    [cityid]
  );

  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (
    event: TouchEvent | KeyboardEvent | MouseEvent
  ): void => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" ||
        (event as KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  if (pvz.length === 0) {
    return (
      <div className={classes.root}>
        <Typography
          variant="body1"
          component="div"
          className="font-weight-black"
        >
          В этом городое нет доступных ПВЗ
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Button
        onClick={toggleDrawer(true)}
        variant="contained"
        color="primary"
        size="small"
      >
        Список ПВЗ
      </Button>
      {pvzSelect && (
        <Box p={1} mt={1}>
          <Divider />
          <Typography
            variant="body1"
            component="div"
            className="font-weight-black"
          >
            Выбран ПВЗ:
          </Typography>
          <DeliveryPvzDescr
            item={pvzSelect}
            selected={true}
            divider_end={true}
          />
        </Box>
      )}
      <Box mt={1}>
        <MapPvz
          pvz={pvz}
          pvzSelect={pvzSelect}
          handleSetPvz={handleSetPvz}
          yaMapKey={yaMapKey}
        />
      </Box>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer(false)}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Typography
            noWrap
            variant="body2"
            component="div"
            className="font-weight-black ml-1"
          >
            Список ПВЗ
          </Typography>
        </div>
        {/* <Divider /> */}
        <List className={classes.list} dense>
          {pvz.map((item, index) => (
            <ListItemPvz
              item={item}
              pvzSelect={pvzSelect}
              index={index}
              key={index}
              handleSetPvz={handleSetPvz}
            />
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default DeliveryPvzSelComp;
