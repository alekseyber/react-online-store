import React from 'react';
import { PageBase } from '../../hoc/PageBase';
import Delivery from '../../containers/delivery/delivery';

export default () => {

    const bind = {
        name_page: "Доставка",
        action_page: "Доставка с примеркой во все города России",
        link_page: "/delivery",
        title: "О доставке и оплате",
        //  filter_on: false,
        // breadcrumbs_data: []
    }

    return (
        <PageBase {...bind}>
            <Delivery />
        </PageBase>
    )
}