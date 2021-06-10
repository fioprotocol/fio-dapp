import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderCheckout } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';
import '../../helpers/gt-sdk';
import { ROUTES } from '../../constants/routes';
import { totalCost, handleFreeAddressCart } from '../../utils';

const CheckoutPage = props => {
  const {
    fioWallets,
    refreshBalance,
    cartItems,
    history,
    paymentWalletId,
    isAuthenticated,
    setWallet,
    domains,
    hasFreeAddress,
    recalculate,
    prices,
  } = props;

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (!currentWallet && fioWallets.length === 1) {
        setWallet(fioWallets[0].id);
      }
    }
  }, []);

  const currentWallet =
    paymentWalletId &&
    !isEmpty(fioWallets) &&
    fioWallets.find(item => item.id === paymentWalletId);

  const isFree =
    !isEmpty(cartItems) && cartItems.length === 1 && !hasFreeAddress;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES);
    }

    if (
      !isEmpty(fioWallets) &&
      !isFree &&
      currentWallet &&
      currentWallet.balance < totalCost(cartItems).costFio
    ) {
      history.push(ROUTES.CART);
    }
  }, [isAuthenticated, fioWallets]);

  useEffect(async () => {
    await handleFreeAddressCart({
      domains,
      fioWallets,
      recalculate,
      cartItems,
      prices,
      hasFreeAddress,
    });
  }, [domains, fioWallets, hasFreeAddress, prices]);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  return (
    <PseudoModalContainer title="Make Purchase" onClose={onClose}>
      <CheckoutPurchaseContainer isCheckout>
        <RenderCheckout
          cart={cartItems}
          isDesktop={isDesktop}
          isFree={isFree}
          currentWallet={currentWallet}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
