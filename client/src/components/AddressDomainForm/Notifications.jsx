import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../AddressDomainBadge/AddressDomainBadge';
import InfoBadge from '../InfoBadge/InfoBadge';
import { deleteCartItem, domainFromList } from '../../utils';

import classes from './AddressDomainForm.module.scss';

const AVAILABLE_MESSAGE = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]:
    'The FIO address you requested is available',
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]:
    'The FIO domain you requested is available',
};

const Notifications = props => {
  const {
    formProps,
    hasCustomDomain,
    showAvailable,
    toggleShowAvailable,
    type,
    cartItems,
    addItem,
    deleteItem,
    prices,
    isAddress,
    isDomain,
    formErrors,
    isFree,
    recalculate,
    domains,
    currentCartItem,
  } = props;
  const { values, form } = formProps;
  const errors = [];

  !isEmpty(formErrors) &&
    Object.keys(formErrors).forEach(key => {
      const fieldState = form.getFieldState(key) || {};
      const { touched, modified, submitSucceeded } = fieldState;
      if (touched || modified || submitSucceeded) {
        errors.push(formErrors[key]);
      }
    });

  const { address, domain: domainName } = values || {};
  const {
    usdt: { domain: domainPrice, address: addressPrice },
    fio: { domain: fioDomainPrice, address: fioAddressPrice },
  } = prices;

  const hasOnlyDomain =
    domainName &&
    cartItems.some(
      item => !item.address && item.domain === domainName.toLowerCase(),
    );
  const hasErrors = !isEmpty(errors);
  let costUsdc;
  let costFio;

  if (!isFree && isAddress) {
    costUsdc = isAddress ? parseFloat(addressPrice) : parseFloat(domainPrice);
    costFio = isAddress
      ? parseFloat(fioAddressPrice)
      : parseFloat(fioDomainPrice);
  }
  if (hasCustomDomain) {
    costUsdc = costUsdc
      ? costUsdc + parseFloat(domainPrice)
      : parseFloat(domainPrice);
    costFio = costFio
      ? costFio + parseFloat(fioDomainPrice)
      : parseFloat(fioDomainPrice);
  }
  if (!isFree && currentCartItem) {
    costFio = currentCartItem.costFio;
    costUsdc = currentCartItem.costUsdc;
  }

  const addItemToCart = () => {
    let id = '';
    if (address) {
      id = address + '@';
    }

    id += domainName;

    const data = {
      ...values,
      costFio: costFio,
      costUsdc: costUsdc,
      id,
      allowFree: domainFromList({ domains, domain: domainName }).free,
    };

    if ((address && hasCustomDomain) || hasOnlyDomain)
      data.hasCustomDomain = true;
    if (costFio) data.costFio = costFio;
    if (costUsdc) data.costUsdc = costUsdc;
    if (address && hasOnlyDomain) {
      data.costFio += parseFloat(fioDomainPrice);
      data.costUsdc += parseFloat(domainPrice);
      recalculate([
        ...cartItems.filter(item => item.domain !== domainName.toLowerCase()),
        data,
      ]);
    } else {
      addItem(data);
    }
  };

  const notifBadge = () => (
    <>
      <InfoBadge
        type={BADGE_TYPES.SUCCESS}
        show={showAvailable}
        title="Available!"
        message={AVAILABLE_MESSAGE[type]}
      />
      {errors.map(error => {
        if (error.message) {
          return (
            <InfoBadge
              type={error.showInfoError ? BADGE_TYPES.INFO : BADGE_TYPES.ERROR}
              title={error.showInfoError ? '' : 'Try Again!'}
              show={hasErrors}
              message={error.message}
              key={error.message}
            />
          );
        }
        return (
          <InfoBadge
            type={BADGE_TYPES.ERROR}
            title="Try Again!"
            show={hasErrors}
            message={error}
            key={error}
          />
        );
      })}
    </>
  );

  return (
    <div key="badges">
      {notifBadge()}
      <Badge type={BADGE_TYPES.SIMPLE} show={showAvailable}>
        <div
          className={classnames(
            classes.addressContainer,
            !hasErrors && classes.showPrice,
          )}
        >
          <p className={classes.address}>
            {isAddress && (
              <>
                <span className={classes.name}>{address}</span>@
              </>
            )}
            {isDomain ? (
              <span className={classes.name}>{domainName}</span>
            ) : (
              domainName
            )}
          </p>
          <p className={classes.price}>
            {isFree && !hasCustomDomain ? (
              'FREE'
            ) : (
              <>
                {costFio && costFio.toFixed(2)}FIO{' '}
                {costUsdc && (
                  <span className={classes.usdcAmount}>
                    ({costUsdc.toFixed(2)} USDC)
                  </span>
                )}
              </>
            )}
          </p>
          <div className={classes.actionContainer}>
            <Button
              className={classnames(
                classes.button,
                !currentCartItem && classes.show,
              )}
              onClick={addItemToCart}
            >
              <FontAwesomeIcon icon="plus-square" className={classes.icon} />
              Add to Cart
            </Button>
            <div
              className={classnames(
                classes.added,
                currentCartItem && classes.show,
              )}
            >
              <div className={classes.fioBadge}>
                <FontAwesomeIcon icon="check-circle" className={classes.icon} />
                <p className={classes.title}>Added</p>
              </div>
              <FontAwesomeIcon
                icon="times-circle"
                className={classes.iconClose}
                onClick={() => {
                  deleteCartItem({
                    id: currentCartItem.id,
                    prices,
                    deleteItem,
                    cartItems,
                    recalculate,
                    domains,
                  });
                  toggleShowAvailable(false);
                }}
              />
            </div>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default Notifications;
