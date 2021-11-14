import { useState, ChangeEvent, useRef, FC } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ButtonProgress from "../buttonprogress/ButtonProgress";
import OrderDelivery from "../../containers/orderdelivery/OrderDelivery";
import { openOferta } from "../../graphql/localVarsModal";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { APP_FORM_QUERY, IAppForm } from "../../graphql/gqlQuery";

const CssForm = styled("form")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  "& .app-form-row": {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
}));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     marginBottom: theme.spacing(1),
//     marginTop: theme.spacing(1),
//   },
//   row: {
//     marginBottom: theme.spacing(0.5),
//     marginTop: theme.spacing(0.5),
//   },
// }));

type TVariant = "filled" | "outlined" | "standard" | undefined;

interface IDataForm {
  action?: number;
  recaptchaToken?: string | null;
  name?: string;
  phone?: string;
  street?: string;
  house?: string;
  flat?: string;
  oferta?: boolean;
  comment?: string;
}

interface AppFormProps {
  handleInputSubmit: (formDataInput: any) => void;
  fullOrder?: boolean;
  variant?: TVariant;
  ofertaOn?: boolean;
  commentOn?: boolean;
  btnText?: string;
  returnproduct?: boolean;
  commentAdd?: boolean;
  reOn?: boolean;
}

const AppForm: FC<AppFormProps> = ({
  handleInputSubmit,
  fullOrder = true,
  variant = "filled",
  ofertaOn = true,
  commentOn = true,
  btnText = "Отправить заказ",
  returnproduct = false,
  commentAdd = false,
  reOn = false,
}) => {
  //const [checked, setChecked] = useState(true);
  const [value, setValueRadio] = useState(0);

  const { data } = useQueryApp<IAppForm>(APP_FORM_QUERY);

  const deliverySelect = data ? data.deliverySelect : 0;
  const googleReKey = data ? data.googleReKey : "";

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm(); //, watch

  const onSubmit = async (data: IDataForm): Promise<void> => {
    if (returnproduct) {
      data.action = value;
    }

    if (reOn && recaptchaRef) {
      if (recaptchaRef.current) {
        const token = await recaptchaRef.current.executeAsync();
        data.recaptchaToken = token;
      }
    }

    handleInputSubmit(data);
  };

  let helperPhoneText = "";
  if (errors.phone && errors.phone.type === "required") {
    helperPhoneText = "Пожалуйста, введите телефон";
  }
  if (
    errors.phone &&
    (errors.phone.type === "pattern" || errors.phone.type === "minLength")
  ) {
    helperPhoneText = "Пожалуйста, введите телефон в формате 7 ### ### ## ##";
  }

  // const handleChange = () => {
  //   setChecked(!checked);
  // };
  const handleChangeRadio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRadio(parseInt(event.target.value, 10));
  };
  const handleBtnOferta = () => {
    openOferta();
  };

  const colorLabelOferta =
    errors.oferta !== undefined ? "error" : "textSecondary";
  const maxComment: number = commentAdd ? 1000 : 350;
  const commentTitle: string = commentAdd ? "Отзыв" : "Комментарий";
  const commentRows = commentAdd ? 5 : 3;

  const commentRulles: { maxLength: number; required?: boolean } = {
    maxLength: maxComment,
  };
  if (commentAdd) {
    commentRulles.required = true;
  }

  const fieldRules = {
    name: { required: true, maxLength: 150 },
    street: { maxLength: 110 },
    house: { maxLength: 20 },
    flat: { maxLength: 20 },
    oferta: { required: true },
    comment: commentRulles,
    phone: {
      required: true,
      minLength: 11,
      pattern:
        // eslint-disable-next-line no-useless-escape
        /^((\+?7|8)[\-]?)?((\(\d{3}\))|(\d{3}))?([\-])?(\d{3}[\-]?\d{2}[\-]?\d{2})$/,
    },
  };

  return (
    <CssForm
      // className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2} className="app-form-row">
        <Grid item xs={12} sm={6} md={7}>
          {returnproduct && (
            <FormControl component="fieldset">
              <FormLabel component="legend">Выберите операцию:</FormLabel>
              <RadioGroup
                name="action"
                onChange={handleChangeRadio}
                value={value}
              >
                {["Обмен", "Возврат"].map((item, i) => (
                  <FormControlLabel
                    value={i}
                    control={<Radio />}
                    label={item}
                    key={i}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {!returnproduct && (
            <TextField
              {...register("name", fieldRules.name)}
              label="Имя*"
              name="name"
              error={errors.name !== undefined}
              helperText={
                (errors.name !== undefined &&
                  errors.name.type === "required" &&
                  "Пожалуйста, введите имя") ||
                (errors.name !== undefined &&
                  errors.name.type === "maxLength" &&
                  "Пожалуйста, введите имя до 150 знаков")
              }
              // helperText={(errors.name !== undefined) && 'Пожалуйста, введите имя'}
              fullWidth
              defaultValue=""
              variant={variant}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          {returnproduct && (
            <Typography
              variant="caption"
              component="div"
              className="font-weight-black"
              gutterBottom
            >
              Пожалуйста, введите номер телефона, указанный в заказе:
            </Typography>
          )}
          {!commentAdd && (
            <NumberFormat
              {...register("phone", fieldRules.phone)}
              defaultValue=""
              label="Телефон*"
              type="tel"
              // name="phone"
              error={errors.phone !== undefined}
              customInput={TextField}
              format="# ### ###-##-##"
              mask="_"
              allowEmptyFormatting
              helperText={helperPhoneText}
              fullWidth
              variant={variant}
              onValueChange={({ value }) => {
                // const { formattedValue, value } = values;
                setValue("phone", value);
              }}
            />
          )}
        </Grid>
      </Grid>
      <Divider />
      {fullOrder && <OrderDelivery variant={variant} />}
      {deliverySelect === 0 && fullOrder && (
        <>
          <Divider />
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            className="mt-1"
          >
            Укажите адрес доставки
          </Typography>
          <Grid container spacing={2} className="app-form-row">
            <Grid item xs={12}>
              <TextField
                {...register("street", fieldRules.street)}
                label="Улица"
                name="street"
                fullWidth
                error={errors.street !== undefined}
                defaultValue=""
                variant={variant}
                helperText={
                  errors.street !== undefined &&
                  "Пожалуйста, введите текст до 110 знаков"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register("house", fieldRules.house)}
                label="Дом, корп., стр."
                name="house"
                fullWidth
                defaultValue=""
                variant={variant}
                error={errors.house !== undefined}
                helperText={
                  errors.house !== undefined &&
                  "Пожалуйста, введите текст до 20 знаков"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register("flat", fieldRules.flat)}
                label="Кв/Оф"
                name="flat"
                fullWidth
                defaultValue=""
                variant={variant}
                error={errors.flat !== undefined}
                helperText={
                  errors.flat !== undefined &&
                  "Пожалуйста, введите текст до 20 знаков"
                }
              />
            </Grid>
          </Grid>
        </>
      )}
      {ofertaOn && (
        <Box mt={2} mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                // checked={true}
                defaultChecked
                // name="oferta"
                color="primary"
                //  onChange={handleChange}
                {...register("oferta", fieldRules.oferta)}
              />
            }
            label={
              <Typography
                variant="caption"
                component="span"
                color={colorLabelOferta}
              >
                Я согласен с условиями публичной оферты и обработкой моих
                персональных данных в порядке, предусмотренном публичной офертой
              </Typography>
            }
          />
          {errors.oferta !== undefined && (
            <>
              <Typography
                variant="caption"
                component="div"
                color="error"
                gutterBottom
              >
                Пожалуйста, подтвердите свое согласие
              </Typography>
              <Button onClick={handleBtnOferta} size="small">
                Ознакомиться с публичной офертой
              </Button>
            </>
          )}
        </Box>
      )}
      {commentOn && (
        <TextField
          className="app-form-row"
          {...register("comment", fieldRules.comment)}
          label={commentTitle}
          name="comment"
          defaultValue=""
          fullWidth
          multiline
          rows={commentRows}
          error={errors.comment !== undefined}
          variant={variant}
          helperText={
            errors.comment !== undefined &&
            `Пожалуйста, введите текст до ${maxComment} знаков`
          }
        />
      )}
      <Box mt={2}>
        <ButtonProgress type="submit">{btnText}</ButtonProgress>
      </Box>
      {reOn && (
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={googleReKey} />
      )}
    </CssForm>
  );
};

export default AppForm;
