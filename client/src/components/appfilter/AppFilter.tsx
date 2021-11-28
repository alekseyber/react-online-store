import { useState, FC, TouchEvent, KeyboardEvent, MouseEvent } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import ItemGrupp from "./itemgrupp/ItemGrupp";
import ItemGruppMbile from "./itemgruppmobile/ItemGruppMobile";
import {
  removeFilterSelect,
  IFilterSelectGr,
} from "../../graphql/localVarsFilter";
import { IFilterGrupp } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  btngr: {
    marginRight: theme.spacing(1),
    fontSize: theme.typography.pxToRem(11),
  },
  btnclose: {
    marginLeft: theme.spacing(2),
  },
  titlepanel: {
    flexGrow: 1,
  },
}));

interface AppFilterProps {
  category: boolean;
  btnClear: boolean;
  mobile: boolean;
  rootCategory: string;
  filterRezult: IFilterGrupp[];
  filterSelect: IFilterSelectGr;
}

export interface ItemGruppProps {
  itemGr: IFilterGrupp;
  filterSelect: IFilterSelectGr;
}

interface BtnsProps {
  barOn?: boolean;
}

const AppFilter: FC<AppFilterProps> = ({
  filterRezult,
  filterSelect,
  category,
  rootCategory,
  btnClear,
  mobile,
}) => {
  const classes = useStyles();

  const [state, setState] = useState(false);

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

      setState(open);
    };

  const handleClear = () => {
    removeFilterSelect();
  };

  const Btns: FC<BtnsProps> = ({ barOn = false }) => {
    const size: "large" | "medium" | "small" = barOn ? "small" : "medium";
    const color: "default" | "inherit" | "primary" | "secondary" = barOn
      ? "inherit"
      : "primary";

    const onClick = barOn ? () => toggleDrawer(false) : undefined;

    return (
      <>
        {btnClear && category && (
          <Button
            variant="outlined"
            color={color}
            onClick={handleClear}
            className={classes.btngr}
            size={size}
          >
            Очистить
          </Button>
        )}
        {btnClear && !category && (
          <Button
            variant="outlined"
            color={color}
            className={classes.btngr}
            size={size}
            component={Link}
            to={rootCategory}
            onClick={onClick}
          >
            Результат
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      {mobile && (
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(true)}
          className={classes.btngr}
          // size="small"
        >
          Фильтр
        </Button>
      )}
      <Btns />
      {!mobile &&
        filterRezult.map((item) => (
          <ItemGrupp
            key={item.alias}
            itemGr={item}
            filterSelect={filterSelect}
          />
        ))}
      {mobile && (
        <Drawer anchor="bottom" open={state} onClose={toggleDrawer(false)}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.titlepanel}>
                Фильтр
              </Typography>
              <Btns barOn={true} />
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer(false)}
                className={classes.btnclose}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          {filterRezult.map((item) => (
            <ItemGruppMbile
              key={item.alias}
              itemGr={item}
              filterSelect={filterSelect}
            />
          ))}
        </Drawer>
      )}
    </>
  );
};

export default AppFilter;
