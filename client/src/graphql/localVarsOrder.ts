import { makeVar } from "@apollo/client";

interface IOrderDone {
  orderId: string;
  orderNumber: string;
}

export type TOrderDone = IOrderDone | null;

export type TReturnProductStatus = string | null;

export type TCommentStatus = boolean;
export type TReturnCallStatus = boolean;

export const orderDoneVar = makeVar<TOrderDone>(null);
export const returnProductStatusVar = makeVar<TReturnProductStatus>(null);
export const commentStatusVar = makeVar<TCommentStatus>(false);
export const returnCallStatusVar = makeVar<TReturnCallStatus>(false);

// orderDoneVar = {
//   orderId: "5f5e3aa5457353136c07508a",
//   orderNumber: "59-289",
// }
