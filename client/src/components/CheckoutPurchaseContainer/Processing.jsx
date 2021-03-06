import React from 'react';
import Modal from '../Modal/Modal';

import logoAnimation from '../CreateAccountForm/logo-animation.json';
import classes from './CheckoutPurchaseContainer.module.scss';

const Processing = props => {
  return (
    <Modal show={props.isProcessing} backdrop="static" hideCloseButton>
      <div className={classes.processingContainer}>
        <div className={classes.logo}>
          <lottie-player
            id="logo-loading"
            autoplay
            loop
            mode="normal"
            src={JSON.stringify(logoAnimation)}
          ></lottie-player>
        </div>
        <h4 className={classes.title}>Transaction Processing</h4>
        <p className={classes.subtitle}>
          Hang tight while we process your transaction
        </p>
      </div>
    </Modal>
  );
};

export default Processing;
