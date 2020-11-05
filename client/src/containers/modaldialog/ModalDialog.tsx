import React, { useMemo } from "react";
import Dialog from "@material-ui/core/Dialog";
import { hideDialog, IModal } from "../../graphql/localVarsModal";
import SizeChartContent from "./sizechartcontent/SizeChartContent";
import AddedCart from "./addedcart/AddedCart";
import DeliveryModal from "./deliverymodal/DeliveryModal";
import DeliveryPvzModal from "./deliverypvzmodal/DeliveryPvzModal";
import QOrder from "./qorder/QOrder";
import OfertaContentModal from "./ofertacontentmodal/OfertaContentModal";
import ReturnCall from "./returncall/ReturnCall";
import { MODAL_DIALOG_QUERY, IModalDialog } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const ModalDialog: React.FC = () => {
  const { data } = useQueryApp<IModalDialog>(MODAL_DIALOG_QUERY);

  const { modalData, open } = useMemo<{
    modalData: IModal;
    open: boolean;
  }>(() => {
    const rezult: { modalData: IModal; open: boolean } = {
      modalData: {
        plagin: 0,
        fullWidth: false,
        maxWidth: false,
        scroll: "paper",
        sizechart: "",
      },
      open: false,
    };

    if (data) {
      if (data.modalRootData) {
        rezult.open = true;
        rezult.modalData.plagin = data.modalRootData.plagin;
        rezult.modalData.scroll = data.modalRootData.scroll;
        rezult.modalData.fullWidth = data.modalRootData.fullWidth;
        rezult.modalData.maxWidth = data.modalRootData.maxWidth;
        rezult.modalData.sizechart = data.modalRootData.sizechart;
      }
    }

    return rezult;
  }, [data]);

  // const modalData = {
  //   plagin: 0,
  //   fullWidth: false,
  //   maxWidth: false,
  //   scroll: "paper",
  //   sizechart: "",
  // };

  // const open = data ? data.modalRootData !== null : false;

  // if (open) {
  //   modalData.plagin = data.modalRootData.plagin;
  //   modalData.scroll = data.modalRootData.scroll;
  //   modalData.fullWidth = data.modalRootData.fullWidth;
  //   modalData.maxWidth = data.modalRootData.maxWidth;
  //   modalData.sizechart = data.modalRootData.sizechart;
  // }

  const { scroll, fullWidth, maxWidth, plagin, sizechart } = modalData;

  const handleClose = () => {
    hideDialog();
  };

  const ContentDialog: React.FC = () => {
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
};

export default ModalDialog;
