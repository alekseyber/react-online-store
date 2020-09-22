import React from 'react';
import { PageBase } from '../../hoc/PageBase';
import CartPageContent from '../../containers/cartpagecontent/Cartpagecontent'

export default () => {

    const bind = {
        name_page: "Корзина",
        action_page: "Оформить заказ",
        link_page: "/cart",
      //  title: "",
        filter_on: false,
    }

    return (
        <PageBase {...bind}>
            <CartPageContent />
        </PageBase>
    )
}