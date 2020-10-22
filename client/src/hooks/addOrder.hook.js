import { useCallback } from "react";
import { USE_ADD_ORDER_QUERY } from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";
import { showAlert } from "../graphql/localVarsApp";
import { orderDoneVar } from "../graphql/localVarsOrder";
import { cartClear } from "../graphql/localVarsCart";
import { hideDialog } from "../graphql/localVarsModal";
import { ADD_ORDER_MUTATION } from "../graphql/gqlMutation";
import { FormDataClass, useMutationApp } from "./appolloMutationApp.hook";
import { useRouter } from "./router.hook";

const sentOrder = (formDataInput, dataInput, mutate) => {
  try {
    const fieldsForm = ["name", "phone", "street", "house", "flat", "comment"];
    const formData = new FormDataClass(formDataInput, fieldsForm);

    formData.cart = dataInput.cartData;
    formData.discontcupon = dataInput.cuponData.discontcupon;
    formData.cupon = dataInput.cuponData.cuponId;
    formData.cityObj = {
      id: dataInput.cityCurrent.id,
      cityName: dataInput.cityCurrent.cityName,
      oblName: dataInput.cityCurrent.oblName,
    };
    formData.deliveryPrice = null;
    formData.pvzSelectStatus = !!dataInput.pvzSelect;
    formData.pvzSelect = dataInput.pvzSelect;
    formData.deliverySelect = dataInput.deliverySelect;
    if (dataInput.deliveryData.status) {
      formData.deliveryPrice = {
        courier: {
          deliveryDateMax: dataInput.deliveryData.courier.deliveryDateMax,
          deliveryDateMin: dataInput.deliveryData.courier.deliveryDateMin,
          deliveryPeriodMax: dataInput.deliveryData.courier.deliveryPeriodMax,
          deliveryPeriodMin: dataInput.deliveryData.courier.deliveryPeriodMin,
          price: dataInput.deliveryData.courier.price,
          priceByCurrency: dataInput.deliveryData.courier.priceByCurrency,
          tariffId: dataInput.deliveryData.courier.tariffId,
        },
        pvz: {
          deliveryDateMax: dataInput.deliveryData.pvz.deliveryDateMax,
          deliveryDateMin: dataInput.deliveryData.pvz.deliveryDateMin,
          deliveryPeriodMax: dataInput.deliveryData.pvz.deliveryPeriodMax,
          deliveryPeriodMin: dataInput.deliveryData.pvz.deliveryPeriodMin,
          price: dataInput.deliveryData.pvz.price,
          priceByCurrency: dataInput.deliveryData.pvz.priceByCurrency,
          tariffId: dataInput.deliveryData.pvz.tariffId,
        },
      };
    }

    mutate({ variables: { formData } });
  } catch (e) {
    showAlert("Ошибка отправки заказа, повторите попытку позже", "error");
    console.error(e);
  }
};

const useAddOrder = (qorder = false) => {
  const { data, loading: loadingData } = useQueryApp(USE_ADD_ORDER_QUERY);
  const { push } = useRouter();

  const onCompleted = (inputData) => {
    orderDoneVar({
      orderId: inputData.addOrder.order.orderId,
      orderNumber: inputData.addOrder.order.orderNum,
    });
    if (qorder) {
      hideDialog();
    }
    push("/order/done");
    cartClear();
  };

  const { mutate } = useMutationApp(ADD_ORDER_MUTATION, onCompleted);

  const handleSubmit = useCallback(
    (formDataInput) => {
      sentOrder(formDataInput, data, mutate);
    },
    [data, mutate]
  );

  return {
    handleSubmit,
    loadingData,
  };
};

export { useAddOrder };
