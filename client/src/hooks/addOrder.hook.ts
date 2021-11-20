import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { USE_ADD_ORDER_QUERY, IUseAddOrder } from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";
import { showAlert } from "../graphql/localVarsApp";
import { orderDoneVar } from "../graphql/localVarsOrder";
import { cartClear } from "../graphql/localVarsCart";
import { hideDialog } from "../graphql/localVarsModal";
import {
  ADD_ORDER_MUTATION,
  AddOrderMutationVar,
  AddOrderMutation,
  AddOrderMutationInput,
} from "../graphql/gqlMutation";
import { FormDataClass, useMutationApp } from "./appolloMutationApp.hook";


export interface IFormDataInput {
  name: string;
  phone: string;
  street?: string;
  house?: string;
  flat?: string;
  comment?: string;
}

const getVariables = (
  formDataInput: IFormDataInput,
  dataInput: IUseAddOrder
): AddOrderMutationVar => {
  const fieldsForm = ["name", "phone", "street", "house", "flat", "comment"];
  const formDataStart = new FormDataClass<IFormDataInput>(
    formDataInput,
    fieldsForm
  );

  const formData: AddOrderMutationInput = {
    name: formDataStart.name,
    phone: formDataStart.phone,
    street: formDataStart.street,
    house: formDataStart.house,
    flat: formDataStart.flat,
    comment: formDataStart.comment,
    cart: dataInput.cartData,
    discontcupon: dataInput.cuponData.discontcupon,
    cupon: dataInput.cuponData.cuponId,
    cityObj: {
      id: dataInput.cityCurrent.id,
      cityName: dataInput.cityCurrent.cityName,
      oblName: dataInput.cityCurrent.oblName,
    },
    deliveryPrice: null,
    pvzSelectStatus: !!dataInput.pvzSelect,
    pvzSelect: dataInput.pvzSelect,
    deliverySelect: dataInput.deliverySelect,
  };

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

  const variables: AddOrderMutationVar = {
    formData,
  };

  return variables;
};

const useAddOrder = (qorder: boolean = false) => {
  const { data, loading: loadingData } = useQueryApp<IUseAddOrder>(
    USE_ADD_ORDER_QUERY
  );
  const navigate = useNavigate();
  

  const onCompleted = (inputData: AddOrderMutation) => {
    orderDoneVar({
      orderId: inputData.addOrder.order.orderId,
      orderNumber: inputData.addOrder.order.orderNum,
      summa: inputData.addOrder.order.summa,
    });
    if (qorder) {
      hideDialog();
    }
    navigate("/order/done");
    cartClear();
  };

  const { mutate } = useMutationApp<AddOrderMutation, AddOrderMutationVar>(
    ADD_ORDER_MUTATION,
    onCompleted
  );

  const handleSubmit = useCallback(
    (formDataInput: IFormDataInput) => {
      try {
        if (data) {
          const variables = getVariables(formDataInput, data);
          mutate({ variables });
        }
      } catch (e) {
        showAlert("Ошибка отправки заказа, повторите попытку позже", "error");
        console.error(e);
      }
    },
    [data, mutate]
  );

  return {
    handleSubmit,
    loadingData,
  };
};

export { useAddOrder };
