import { useState, FC } from "react";
//import makeStyles from '@mui/styles/makeStyles';
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import { useInput } from "../../hooks/input.hook";
import { cartSetCupon, cartClearCupon } from "../../graphql/localVarsCart";
import ButtonProgress from "../buttonprogress/ButtonProgress";
import {
  CART_ADD_CUPON_QUERY,
  IGetCupon,
  IGetCuponVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

// const useStyles = makeStyles((theme) => ({
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightRegular,
//   },
//   body: {
//     alignItems: "center",
//     display: "flex",
//   },
// }));

const CssAccordion = styled(Accordion)(({ theme }) => ({
  "& .addcupon-heading": {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  "& .addcupon-body": {
    alignItems: "center",
    display: "flex",
  },
}));

const CartAddCupon: FC = () => {
  const [skip, setSkip] = useState(true);
  const inputCupon = useInput("");
  const cuponText = inputCupon.value;

  const onCompleted = (dataInput: IGetCupon) => {
    if (dataInput.getCupon) {
      const setDataCupon = {
        discontcupon: dataInput.getCupon.value,
        cuponId: dataInput.getCupon.cuponId,
      };
      cartSetCupon(setDataCupon);
    } else {
      cartClearCupon();
    }
    setSkip(true);
  };

  const handleSetCupon = () => {
    setSkip(false);
  };

  const { loading } = useQueryApp<IGetCupon, IGetCuponVar>(
    CART_ADD_CUPON_QUERY,
    { cuponText },
    false,
    false,
    "no-cache",
    onCompleted,
    skip
  );

  return (
    <CssAccordion>
      <AccordionSummary>
        <Typography className="addcupon-heading">
          У меня есть промокод
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="addcupon-body">
        <TextField
          label="Введите промокод"
          variant="standard"
          {...inputCupon.bind}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={inputCupon.clear}
                  disabled={inputCupon.value.length === 0}
                  size="large"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <ButtonProgress
          variant="contained"
          color="primary"
          size="small"
          buttonClassname="ml-2"
          onClick={handleSetCupon}
          loading={loading}
          disabled={
            !(inputCupon.value.length > 5 && inputCupon.value.length < 12)
          }
        >
          Применить
        </ButtonProgress>
      </AccordionDetails>
    </CssAccordion>
  );
};

export default CartAddCupon;
