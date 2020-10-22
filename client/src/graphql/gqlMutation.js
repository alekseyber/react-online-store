import { gql } from "@apollo/client";

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

export const COMMENT_ADD_MUTATION = gql`
  mutation AddComment($formData: AddCommentMutationInput!) {
    addComment(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

export const RETURN_CALL_MUTATION = gql`
  mutation AddReturnCall($formData: ReturnCallMutationInput!) {
    addReturnCall(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

export const RETURN_PRODUCT_MUTATION = gql`
  mutation AddReturnProduct($formData: ReturnProductMutationInput!) {
    addReturnProduct(formData: $formData) {
      ...BaseMutationResponseFragment
    }
  }
  ${BaseMutationResponseFragment.fragments.baseMutationResponse}
`;

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
