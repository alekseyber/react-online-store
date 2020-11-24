import { useState, ChangeEvent, useRef, FC } from "react";
import { useForm, Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import InputMask from "react-input-mask";
import TextField, {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import ButtonProgress from "../buttonprogress/ButtonProgress";
import OrderDelivery from "../../containers/orderdelivery/OrderDelivery";
import { openOferta } from "../../graphql/localVarsModal";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { APP_FORM_QUERY, IAppForm } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  row: {
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
}));

type TVariant = "filled" | "outlined" | "standard" | undefined;

declare module "react-input-mask" {
  export interface Props {
    label?: string;
    helperText?: string;
    error?: boolean;
    variant?: TVariant;
  }
}

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

type TTextFieldInputProps =
  | (JSX.IntrinsicAttributes & StandardTextFieldProps)
  | (JSX.IntrinsicAttributes & FilledTextFieldProps)
  | (JSX.IntrinsicAttributes & OutlinedTextFieldProps);

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
  const classes = useStyles();

  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState(0);

  const { data } = useQueryApp<IAppForm>(APP_FORM_QUERY);

  const deliverySelect = data ? data.deliverySelect : 0;
  const googleReKey = data ? data.googleReKey : "";

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { register, handleSubmit, errors, control } = useForm(); //, watch

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
  if (errors.phone && errors.phone.type === "pattern") {
    helperPhoneText = "Пожалуйста, введите телефон";
  }

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleChangeRadio = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value, 10));
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

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2} className={classes.row}>
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
              inputRef={register({ required: true, maxLength: 150 })}
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
            <Controller
              as={InputMask}
              rules={{
                required: true,
                // eslint-disable-next-line
                pattern: /^((\+?7|8)[\-]?)?((\(\d{3}\))|(\d{3}))?([\-])?(\d{3}[\-]?\d{2}[\-]?\d{2})$/,
              }}
              mask="9-999-999-99-99"
              label="Телефон*"
              name="phone"
              error={errors.phone !== undefined}
              helperText={helperPhoneText}
              control={control}
              defaultValue=""
              variant={variant}
            >
              {(inputProps: TTextFieldInputProps) => (
                <TextField {...inputProps} fullWidth />
              )}
            </Controller>
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
          <Grid container spacing={2} className={classes.row}>
            <Grid item xs={12}>
              <TextField
                inputRef={register({ maxLength: 110 })}
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
                inputRef={register({ maxLength: 20 })}
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
                inputRef={register({ maxLength: 20 })}
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
                checked={checked}
                name="oferta"
                color="primary"
                onChange={handleChange}
                inputRef={register({ required: true })}
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
          className={classes.row}
          inputRef={register(commentRulles)}
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
    </form>
  );
};


export default AppForm;
