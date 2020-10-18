import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { hideDialog } from "../../graphql/localVarsModal";
import SizeChartContent from "./sizechartcontent/SizeChartContent";
import AddedCart from "./addedcart/AddedCart";
import DeliveryModal from "./deliverymodal/DeliveryModal";
import DeliveryPvzModal from "./deliverypvzmodal/DeliveryPvzModal";
import QOrder from "./qorder/QOrder";
import OfertaContentModal from "./ofertacontentmodal/OfertaContentModal";
import ReturnCall from "./returncall/ReturnCall";
import { MODAL_DIALOG_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default function ModalDialog() {
  const { data } = useQueryApp(MODAL_DIALOG_QUERY);

  const modalData = {
    plagin: 0,
    fullWidth: false,
    maxWidth: false,
    scroll: "paper",
    sizechart: "",
  };

  const open = data ? data.modalRootData !== null : false;

  if (open) {
    modalData.plagin = data.modalRootData.plagin;
    modalData.scroll = data.modalRootData.scroll;
    modalData.fullWidth = data.modalRootData.fullWidth;
    modalData.maxWidth = data.modalRootData.maxWidth;
    modalData.sizechart = data.modalRootData.sizechart;
  }

  const { scroll, fullWidth, maxWidth, plagin, sizechart } = modalData;

  const handleClose = () => {
    hideDialog();
  };

  const ContentDialog = () => {
    switch (plagin) {
      case 0:
        return (
          <SizeChartContent
            handleClose={handleClose}
            sizesgroupId={sizechart}
          />
        );
      //  break;
      case 1:
        return <AddedCart handleClose={handleClose} />;
      case 2:
        return <DeliveryModal handleClose={handleClose} />;
      case 3:
        return <DeliveryPvzModal handleClose={handleClose} />;
      case 4:
        return <QOrder handleClose={handleClose} />;
      case 5:
        return <OfertaContentModal handleClose={handleClose} />;
      case 6:
        return <ReturnCall handleClose={handleClose} />;

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <>{open && <ContentDialog />}</>
    </Dialog>
  );
}
