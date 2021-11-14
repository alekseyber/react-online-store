import { FC, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { deliverySelectVar } from "../../graphql/localVars";

interface DeliverySelectorProps {
  pvz_price: number;
  courier_price: number;
  currSymbol: string;
  deliverySelect: number;
}

const DeliverySelector: FC<DeliverySelectorProps> = ({
  pvz_price = 0,
  courier_price = 0,
  currSymbol = "",
  deliverySelect = 0,
}) => {
  const arrParams = [
    `Курьер - ${courier_price} ${currSymbol}`,
    `ПВЗ - ${pvz_price} ${currSymbol}`,
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value, 10)) {
      deliverySelectVar(1);
    } else {
      deliverySelectVar(0);
    }
  };

  return (
    <Box mt={0.5} mb={0.5}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Тип доставки</FormLabel>
        <RadioGroup
          name="deliverySelect"
          value={deliverySelect}
          onChange={handleChange}
        >
          {arrParams.map((item, i) => (
            <FormControlLabel
              value={i}
              control={<Radio />}
              label={item}
              key={i}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default DeliverySelector;
