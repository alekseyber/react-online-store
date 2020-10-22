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

export const modalRootDataVar = makeVar(null);
const modalPrevDataVar = makeVar(null);

class ModalDataClass {
  constructor(
    plagin = 0,
    maxWidth = "md",
    sizechart = "",
    fullWidth = false,
    scroll = "paper"
  ) {
    this.plagin = plagin;
    this.fullWidth = fullWidth;
    this.maxWidth = maxWidth;
    this.scroll = scroll;
    this.sizechart = sizechart;
  }
}

export const hideDialog = () => {
  const modalPrevData = modalPrevDataVar();

  if (modalPrevData) {
    modalRootDataVar(modalPrevData);
    modalPrevDataVar(null);
  } else {
    modalRootDataVar(null);
  }
};

const openDialog = (modalDialogData) => {
  const modalRootData = modalRootDataVar();

  if (modalRootData) {
    modalPrevDataVar(modalRootData);
  }
  modalRootDataVar(modalDialogData);
};

export const openSizeChart = (sizechart) => {
  const modalDialogData = new ModalDataClass(0, "md", sizechart);
  openDialog(modalDialogData);
};

export const openAddedCart = () => {
  const modalDialogData = new ModalDataClass(1, false);
  openDialog(modalDialogData);
};

export const openQOrder = () => {
  const modalDialogData = new ModalDataClass(4);
  openDialog(modalDialogData);
};

export const openDelivery = () => {
  const modalDialogData = new ModalDataClass(2, "xl");
  openDialog(modalDialogData);
};

export const openPvzSelector = () => {
  const modalDialogData = new ModalDataClass(3, "xl");
  openDialog(modalDialogData);
};

export const openOferta = () => {
  const modalDialogData = new ModalDataClass(5, "xl");
  openDialog(modalDialogData);
};

export const openReturnCall = () => {
  const modalDialogData = new ModalDataClass(6);
  openDialog(modalDialogData);
};
