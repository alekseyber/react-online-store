import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { hideDialog } from '../../redux/actions/modaldialog';
import SizeChartContent from './sizechartcontent/Sizechartcontent';
import AddedCart from './addedcart/Addedcart';
import DeliveryModal from './deliverymodal/Deliverymodal';
import DeliveryPvzModal from './deliverypvzmodal/Deliverypvzmodal';
import QOrder from './qorder/Qorder';
import OfertaContent from './ofertacontent/Ofertacontent';
import ReturnCall from './returncall/Returncall';

// modalRootData: {
//     open: false,
//     plagin: 0,
//     fullWidth: false,
//     maxWidth: false,
//     scroll: "paper", //body

// },



export default function ModalDialog() {

    const { open, scroll, fullWidth, maxWidth, plagin } = useSelector(state => state.modaldialog.modalRootData);
    const dispatch = useDispatch();



    const handleClose = () => {
        dispatch(hideDialog());
    };


    const ContentDialog = () => {

        switch (plagin) {
            case 0:

                return <SizeChartContent handleClose={handleClose} />
            //  break;
            case 1:
                return <AddedCart handleClose={handleClose} />
            case 2:
                return <DeliveryModal handleClose={handleClose} />
            case 3:
                return <DeliveryPvzModal handleClose={handleClose} />
            case 4:
                return <QOrder handleClose={handleClose} />
            case 5:
                return <OfertaContent handleClose={handleClose} />
            case 6:
                return <ReturnCall handleClose={handleClose} />


            default:
                return null
        }
    }

    // const descriptionElementRef = React.useRef(null);
    // React.useEffect(() => {
    //     if (open) {
    //         const { current: descriptionElement } = descriptionElementRef;
    //         if (descriptionElement !== null) {
    //             descriptionElement.focus();
    //         }
    //     }
    // }, [open]);

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
        >
            <ContentDialog />

        </Dialog >
    );
}