import {
  useState,
  useCallback,
  FC,
  TouchEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LinearProgress from "@mui/material/LinearProgress";
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
    position: "relative",
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

  const toggleDrawer =
    (open: boolean) =>
    (event: TouchEvent | KeyboardEvent | MouseEvent): void => {
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
    <div className={classes.root} id="drawer-pvz-container">
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
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { position: "absolute" } }}
        BackdropProps={{ style: { position: "absolute" } }}
        ModalProps={{
          container: document.getElementById("drawer-pvz-container"),
          style: { position: "absolute" },
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer(false)} size="large">
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
