import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import Notifications from './Notifications';
import FormContainer from './FormContainer';
import debounce from 'lodash/debounce';
import { setDataMutator, cartHasFreeItem } from '../../utils';

import { addressValidation, domainValidation } from './validation';

const AddressDomainForm = props => {
  const {
    domains,
    isHomepage,
    formState,
    type,
    getPrices,
    getDomains,
    fioWallets,
    fioDomains,
    refreshFioWallets,
    refreshFioNames,
    account,
    prices,
    cartItems,
    recalculate,
    hasFreeAddress,
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [showCustomDomain, toggleShowCustomDomain] = useState(false);
  const [showAvailable, toggleShowAvailable] = useState(false);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);

  const options = [
    ...domains.map(({ domain }) => domain),
    ...fioDomains.map(({ name }) => name),
  ];

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  useEffect(() => {
    getPrices();
    getDomains();
    if (account) {
      refreshFioWallets(account);
    }
  }, []);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      refreshFioNames(fioWallet.publicWalletInfo.keys.publicKey);
    }
  }, [fioWallets]);

  const validationProps = {
    options,
    toggleShowAvailable,
    changeFormErrors,
    isAddress,
    toggleValidating,
    cartItems,
    recalculate,
  };

  const handleSubmit = (values, form) => {
    if (isHomepage) return;

    const validationPropsToPass = {
      formProps: form,
      ...validationProps,
    };

    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  };

  const handleChange = formProps => {
    const validationPropsToPass = {
      formProps,
      ...validationProps,
    };
    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  };

  const debouncedHandleChange = debounce(handleChange, 500);

  const renderItems = formProps => {
    const { values: { address, domain } = {} } = formProps || {};

    const currentCartItem = cartItems.find(item => {
      if (!address) return item.domain === domain;
      return item.address === address && item.domain === domain;
    });

    const hasCustomDomain =
      (!isHomepage &&
        domain &&
        options.every(option => option !== domain) &&
        cartItems.every(item => item.domain !== domain)) ||
      isDomain ||
      (currentCartItem && currentCartItem.hasCustomDomain);

    const hasCurrentDomain =
      domain &&
      cartItems.some(
        item =>
          item.domain === domain.toLowerCase() &&
          item.id !== (currentCartItem && currentCartItem.id),
      );

    const isFree =
      (!hasCustomDomain &&
        !cartHasFreeItem(cartItems) &&
        !hasFreeAddress &&
        domains.find(item => item.domain === domain && item.free)) ||
      (currentCartItem && !currentCartItem.costFio);

    const showPrice = ({ isAddressPrice, isDomainPrice }) => {
      const {
        usdt: { address: usdcAddressPrice, domain: usdcDomainPrice },
        fio: { address: fioAddressPrice, domain: fioDomainPrice },
      } = prices;

      const price = isFree
        ? 'FREE'
        : `${
            isAddressPrice
              ? fioAddressPrice.toFixed(2)
              : isDomainPrice
              ? fioDomainPrice.toFixed(2)
              : 'no price'
          } FIO (${
            isAddressPrice
              ? usdcAddressPrice.toFixed(2)
              : isDomainPrice
              ? usdcDomainPrice.toFixed(2)
              : 'no price'
          } USDC)`;

      const cost = isDesktop ? 'Cost: ' : '';
      return isDomainPrice && !hasCustomDomain && hasCurrentDomain
        ? null
        : cost + price;
    };

    return [
      <FormContainer
        formProps={formProps}
        {...props}
        options={options}
        isAddress={isAddress}
        hasCustomDomain={hasCustomDomain}
        showCustomDomain={showCustomDomain}
        toggleShowCustomDomain={toggleShowCustomDomain}
        domain={domain}
        key="form"
        showPrice={showPrice}
        handleChange={handleChange}
        debouncedHandleChange={debouncedHandleChange}
        toggleShowAvailable={toggleShowAvailable}
        isValidating={isValidating}
        formState={formState}
        isFree={isFree}
      />,
      !isHomepage && (
        <Notifications
          formProps={formProps}
          formErrors={formErrors}
          {...props}
          hasCustomDomain={hasCustomDomain}
          showCustomDomain={showCustomDomain}
          currentCartItem={currentCartItem}
          showAvailable={showAvailable}
          toggleShowAvailable={toggleShowAvailable}
          isAddress={isAddress}
          isDomain={isDomain}
          key="notifications"
          isFree={isFree}
        />
      ),
    ];
  };

  return (
    <Form
      onSubmit={handleSubmit}
      mutators={{ setDataMutator }}
      initialValues={formState}
    >
      {renderItems}
    </Form>
  );
};

export default AddressDomainForm;
