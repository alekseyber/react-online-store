import {
  SET_DIALOG,
  OPEN_DIALOG,
  SET_LOADING_DIALOG,
  HIDE_DIALOG,
  SET_SIZECHART_SELECT,
  SET_DIALOG_TITLE,
} from "../constants";

// modalRootData: {
//     open: false,
//     plagin: 0,
//     fullWidth: false,
//     maxWidth: false,
//     scroll: "paper", //body
// },

class ModalDataClass {
  constructor(
    plagin = 0,
    maxWidth = "md",
    fullWidth = false,
    scroll = "paper"
  ) {
    this.open = true;
    this.plagin = plagin;
    this.fullWidth = fullWidth;
    this.maxWidth = maxWidth;
    this.scroll = scroll;
  }
}

// maxWidth	'lg'
// | 'md'
// | 'sm' default
// | 'xl'
// | 'xs'
// | false

export const setDialog = (payload) => {
  return {
    type: SET_DIALOG,
    payload,
  };
};

export const hideDialog = () => {
  return {
    type: HIDE_DIALOG,
  };
};

export const setLoadingDialog = (payload = false) => {
  return {
    type: SET_LOADING_DIALOG,
    payload,
  };
};

export const setTitleDialog = (payload) => {
  return {
    type: SET_DIALOG_TITLE,
    payload,
  };
};

export const openAddedCart = () => {
  const payload = new ModalDataClass(1, false);

  return {
    type: OPEN_DIALOG,
    payload,
  };
};

export const openQOrder = () => {
  const payload = new ModalDataClass(4);

  return {
    type: OPEN_DIALOG,
    payload,
  };
};

export const openDelivery = () => {
  const payload = new ModalDataClass(2, "xl");

  return {
    type: OPEN_DIALOG,
    payload,
  };
};

export const openPvzSelector = () => {
  const payload = new ModalDataClass(3, "xl");

  return {
    type: OPEN_DIALOG,
    payload,
  };
};

export const openSizeChart = (sizechart) => {
  const modalDialogData = new ModalDataClass();
  const payload = {
    modalDialogData,
    sizechart,
  };

  return {
    type: SET_SIZECHART_SELECT,
    payload,
  };
};



export const openOferta = () => {
  const payload = new ModalDataClass(5, "xl");

  return {
    type: OPEN_DIALOG,
    payload,
  };
};

export const openReturnCall = () => {
  const payload = new ModalDataClass(6);

  return {
    type: OPEN_DIALOG,
    payload,
  };
};
