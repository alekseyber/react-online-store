import { FC } from "react";
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { LOADING_BTN_QUERY, ILoadingBtn } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    width: "fit-content",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

interface ButtonProgressProps {
  onClick?: () => void | null;
  buttonClassname?: string;
  disabled?: boolean | undefined;
  variant?: "text" | "contained" | "outlined";
  size?: "medium" | "large" | "small";
  type?: "button" | "reset" | "submit";
  loading?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const ButtonProgress: FC<ButtonProgressProps> = ({
  onClick,
  buttonClassname = "",
  disabled = false,
  color = "primary",
  variant = "contained",
  size = "medium",
  children,
  type = "button",
  loading = false,
}) => {
  const { data } = useQueryApp<ILoadingBtn>(LOADING_BTN_QUERY);
  const loadingBtnCache = data ? data.loadingBtn : false;

  const classes = useStyles();

  const loadingBtn = loading || loadingBtnCache;

  const disabledValue = loadingBtn || disabled;

  // const handleButtonClick = onClick || null;

  return (
    <div className={classes.wrapper}>
      <Button
        variant={variant}
        color={color}
        className={buttonClassname}
        disabled={disabledValue}
        size={size}
        onClick={onClick}
        type={type}
      >
        {children}
      </Button>
      {loadingBtn && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};


export default ButtonProgress;
