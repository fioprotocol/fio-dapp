import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import classes from '../Purchase/Purchase.module.scss';
import { executeRegistration } from './middleware';
import { sleep } from '../../utils';

export const PurchaseNow = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWallet,
    showPinModal,
    checkCaptcha,
    recordFreeAddress,
    confirmingPin,
    captchaResolving,
    onFinish,
    setProcessing,
    setRegistration,
    isRetry,
  } = props;

  const [isWaiting, setWaiting] = useState(false);
  const t0 = performance.now();

  const waitFn = async fn => {
    const t1 = performance.now();

    if (t1 - t0 < 3000) {
      await sleep(3000 - (t1 - t0));
    }
    fn();
  };

  const loading = confirmingPin || captchaResolving;

  // registration
  useEffect(async () => {
    const { keys, error } = pinConfirmation;
    if (keys && keys[paymentWallet.id] && isWaiting) {
      setProcessing(true);
      const results = await executeRegistration(
        cartItems,
        keys[paymentWallet.id],
      );
      setWaiting(false);
      setRegistration(results);
      waitFn(onFinish);
    }

    if (error) setWaiting(false);
  }, [pinConfirmation]);

  useEffect(async () => {
    const { success, verifyParams } = captchaResult;

    if (success && isWaiting) {
      setProcessing(true);
      const results = await executeRegistration(
        cartItems,
        {
          public: paymentWallet.publicKey,
        },
        verifyParams,
      );

      for (const item of results.registered) {
        recordFreeAddress(item.fioName);
      }

      setWaiting(false);
      setRegistration(results);
      waitFn(onFinish);
    }

    if (success === false) setWaiting(false);
  }, [captchaResult]);

  const purchase = () => {
    setWaiting(true);
    for (const item of cartItems) {
      if (item.costFio) {
        return showPinModal();
      }
    }
    checkCaptcha();
  };

  return (
    <Button onClick={purchase} className={classes.button} disabled={loading}>
      {isRetry ? 'Try Again' : 'Purchase Now'}
    </Button>
  );
};
