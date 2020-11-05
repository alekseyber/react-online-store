import { makeVar } from "@apollo/client";

// modalRootData: {
//     plagin: 0,
//     fullWidth: false,
//     maxWidth: false,
//     scroll: "paper", //body
// sizechartSelect: ''

// },

// maxWidth	'lg'
// | 'md'
// | 'sm' default
// | 'xl'
// | 'xs'
// | false

export interface IModal {
  plagin: number;
  maxWidth: false | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  sizechart: string;
  scroll: "paper" | "body" | undefined;
  fullWidth: boolean;
}

export type TModal = null | IModal;

export const modalRootDataVar = makeVar<TModal>(null);
const modalPrevDataVar = makeVar<TModal>(null);

class ModalDataClass {
  constructor(
    public plagin: number = 0,
    public maxWidth: false | "xs" | "sm" | "md" | "lg" | "xl" = "md",
    public sizechart: string = "",
    public fullWidth: boolean = false,
    public scroll: "paper" | "body" = "paper"
  ) {
    this.plagin = plagin;
    this.fullWidth = fullWidth;
    this.maxWidth = maxWidth;
    this.scroll = scroll;
    this.sizechart = sizechart;
  }
}

export const hideDialog = (): void => {
  const modalPrevData = modalPrevDataVar();

  if (modalPrevData) {
    modalRootDataVar(modalPrevData);
    modalPrevDataVar(null);
  } else {
    modalRootDataVar(null);
  }
};

const openDialog = (modalDialogData: IModal): void => {
  const modalRootData = modalRootDataVar();

  if (modalRootData) {
    modalPrevDataVar(modalRootData);
  }
  modalRootDataVar(modalDialogData);
};

export const openSizeChart = (sizechart: string): void => {
  const modalDialogData = new ModalDataClass(0, "md", sizechart);
  openDialog(modalDialogData);
};

export const openAddedCart = (): void => {
  const modalDialogData = new ModalDataClass(1);
  openDialog(modalDialogData);
};

export const openQOrder = (): void => {
  const modalDialogData = new ModalDataClass(4);
  openDialog(modalDialogData);
};

export const openDelivery = (): void => {
  const modalDialogData = new ModalDataClass(2, "xl");
  openDialog(modalDialogData);
};

export const openPvzSelector = (): void => {
  const modalDialogData = new ModalDataClass(3, "xl");
  openDialog(modalDialogData);
};

export const openOferta = (): void => {
  const modalDialogData = new ModalDataClass(5, "xl");
  openDialog(modalDialogData);
};

export const openReturnCall = (): void => {
  const modalDialogData = new ModalDataClass(6);
  openDialog(modalDialogData);
};
