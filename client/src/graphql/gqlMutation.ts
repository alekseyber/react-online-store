import { gql } from "@apollo/client";
import { ICity, TPvzSelect } from "./localVars";
import { TCartData } from "./localVarsCart";
import { DeliveryInf } from "./gqlQuery";

interface IBaseMutationResponseFragment {
  code: string;
  success: boolean;
  message: string;
}

type OrderResponse = {
  orderNum: string;
  orderId: string;
};

const BaseMutationResponseFragment = {
  fragments: {
    baseMutationResponse: gql`
      fragment BaseMutationResponseFragment on BaseMutationResponse {
        code
        success
        message
      }
    `,
  },
};

export type AddCommentMutationInput = {
  authorName: string;
  commenText: string;
  recaptchaToken: string;
};

export interface AddCommentMutationVar {
  formData: AddCommentMutationInput;
}

export interface AddCommentMutation {
  addComment: IBaseMutationResponseFragment;
}

export const COMMENT_ADD_MUTATION = gql`
  mutation AddComment($formData: AddCommentMutationInput!) {
    addComment(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

export type ReturnCallMutationInput = {
  name: string;
  phone: string;
  comment: string;
  recaptchaToken: string;
};

export interface AddReturnCallMutationVar {
  formData: ReturnCallMutationInput;
}

export interface AddReturnCallMutation {
  addReturnCall: IBaseMutationResponseFragment;
}

export const RETURN_CALL_MUTATION = gql`
  mutation AddReturnCall($formData: ReturnCallMutationInput!) {
    addReturnCall(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

export type ReturnProductMutationInput = {
  action: number;
  phone: string;
  recaptchaToken: string;
};

export interface AddReturnProductMutationVar {
  formData: ReturnProductMutationInput;
}

export interface AddReturnProductMutation {
  addReturnProduct: IBaseMutationResponseFragment;
}

export const RETURN_PRODUCT_MUTATION = gql`
  mutation AddReturnProduct($formData: ReturnProductMutationInput!) {
    addReturnProduct(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

type DeliveryPrice = {
  pvz: DeliveryInf;
  courier: DeliveryInf;
};

export type AddOrderMutationInput = {
  name: string;
  phone: string;
  street: string;
  house: string;
  flat: string;
  comment: string;
  discontcupon: number;
  cupon: string;
  pvzSelectStatus: boolean;
  deliverySelect: number;
  pvzSelect: TPvzSelect;
  deliveryPrice: DeliveryPrice | null;
  cityObj: ICity;
  cart: TCartData;
};

interface AddOrderMutationResponse extends IBaseMutationResponseFragment {
  order: OrderResponse;
}

export interface AddOrderMutation {
  addOrder: AddOrderMutationResponse;
}

export interface AddOrderMutationVar {
  formData: AddOrderMutationInput;
}

export const ADD_ORDER_MUTATION = gql`
  mutation AddOrder($formData: AddOrderMutationInput!) {
    addOrder(formData: $formData) {
      code
      success
      message
      order {
        orderNum
        orderId
      }
    }
  }
`;
