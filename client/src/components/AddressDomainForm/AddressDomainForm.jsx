import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import Notifications from './Notifications';
import FormContainer from './FormContainer';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
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
    refreshFioWallets,
    account,
    prices,
    cartItems,
    recalculate,
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [showCustomDomain, toggleShowCustomDomain] = useState(false);
  const [showAvailable, toggleShowAvailable] = useState(false);
  const [userDomains, setUserDomains] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);

  const options = [
    ...domains.map(({ domain }) => domain),
    ...userDomains.map(({ name }) => name),
  ];

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  const setUserAddressesAndDomains = async () => {
    if (fioWallets) {
      const userDomains = [];
      const userAddresses = [];
      for (const fioWallet of fioWallets) {
        const domains = await fioWallet.otherMethods.getFioDomains();
        const addresses = await fioWallet.otherMethods.getFioAddresses();
        if (domains.length) userDomains.push(domains);
        if (addresses.length) userAddresses.push(addresses);
      }
      setUserDomains(userDomains);
      setUserAddresses(userAddresses);
    }
  };

  useEffect(() => {
    getPrices();
    getDomains();
    if (account) {
      refreshFioWallets(account);
    }
    setUserAddressesAndDomains();
    return () => {
      setUserDomains([]);
      setUserAddresses([]);
    };
  }, []);

  useEffect(() => {
    setUserAddressesAndDomains();
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

    const currentCartItem = cartItems.find(
      item => address && item.address === address && item.domain === domain,
    );

    const isCustomDomain =
      (!isHomepage &&
        domain &&
        options.every(option => option !== domain) &&
        cartItems.every(item => item.domain !== domain)) ||
      isDomain ||
      (currentCartItem && currentCartItem.isCustomDomain);

    const hasCurrentDomain =
      domain &&
      cartItems.some(
        item =>
          item.domain === domain.toLowerCase() &&
          item.id !== (currentCartItem && currentCartItem.id),
      );

    const isFree =
      (!isCustomDomain &&
        !cartHasFreeItem(cartItems) &&
        isEmpty(userAddresses)) ||
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
      return isDomainPrice && !isCustomDomain && hasCurrentDomain
        ? null
        : cost + price;
    };

    return [
      <FormContainer
        formProps={formProps}
        {...props}
        options={options}
        isAddress={isAddress}
        isCustomDomain={isCustomDomain}
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
          isCustomDomain={isCustomDomain}
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
