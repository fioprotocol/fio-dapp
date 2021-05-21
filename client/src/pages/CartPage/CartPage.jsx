import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';
import { handleFreeAddressCart } from '../../utils';

const CartPage = props => {
  const {
    cartItems,
    history,
    fioWallets,
    recalculate,
    prices,
    account,
    domains,
    userWallets,
    setWallet,
    paymentWallet,
  } = props;

  useEffect(() => {
    if (
      !isEmpty(cartItems) &&
      cartItems.length === 1 &&
      userWallets.length === 1
    ) {
      history.push(ROUTES.CHECKOUT);
    }
  }, []);

  useEffect(async () => {
    if (!account) {
      history.push(ROUTES.FIO_ADDRESSES);
    }
    await handleFreeAddressCart({
      domains,
      fioWallets,
      recalculate,
      cartItems,
      prices,
    });
  }, [account, domains, fioWallets]);

  return (
    <DoubleCardContainer
      title="Your Cart"
      secondTitle="Amount Due"
      bigCart={<Cart {...props} setWallet={setWallet} />}
      smallCart={<CartAmount {...props} selectedWallet={paymentWallet} />}
    />
  );
};

export default CartPage;
