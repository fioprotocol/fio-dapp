import _ from 'lodash';
import { ADDRESS_REGEXP } from '../../constants/regExps';
import { sleep } from '../../utils';

const verifyAddress = async props => {
  const {
    values,
    forceValidate,
    toggleAvailable,
    changePrevValues,
    options,
    prevValues,
  } = props;
  const { domain, username } = values;
  const errors = {};

  if (_.isEqual(values, prevValues) && !forceValidate) return;
  //todo: mocked request call
  const availCheck = async () => {
    await sleep(1000);
    return { is_registered: 0 };
  };

  if (domain) {
    const isAvail = await availCheck();
    if (
      isAvail &&
      isAvail.is_registered === 1 &&
      options.every(option => option !== domain)
    ) {
      errors.domain =
        'Unfortunately the domain name you have selected is not available. Please select an alternative.';
    }
  }

  if (username && domain) {
    const isAvail = await availCheck();
    if (isAvail && isAvail.is_registered === 1) {
      errors.username = 'This FIO Address is already registered.';
    }
  }

  if (_.isEmpty(errors)) {
    toggleAvailable(true);
  }

  changePrevValues(values);

  return errors;
};

export const addressValidation = props => {
  const { values, toggleAvailable } = props;
  const errors = {};
  const { username, domain } = values || {};

  if (!username) {
    errors.username = 'Username Field Should Be Filled';
  }
  if (username && !ADDRESS_REGEXP.test(username)) {
    errors.username = 'Username only allows letters, numbers and dash';
  }

  if (!domain) {
    errors.domain = 'Select Domain Please';
  }
  if (!ADDRESS_REGEXP.test(domain)) {
    errors.domain = 'Domain name only allows letters, numbers and dash';
  }
  if (domain && domain.length > 62) {
    errors.username = 'Domain name should be less than 62 characters';
  }

  if (username && domain && username.length + domain.length > 63) {
    errors.username = 'Address should be less than 63 characters';
  }

  if (!_.isEmpty(errors)) {
    toggleAvailable(false);
  }

  return !_.isEmpty(errors) ? errors : verifyAddress(props);
};

export const domainValidation = props => {
  const { values, toggleAvailable } = props;
  const errors = {};
  const { domain } = values || {};

  if (!domain) {
    errors.domain = 'Select Domain Please';
  }
  if (!ADDRESS_REGEXP.test(domain)) {
    errors.domain = 'Domain name only allows letters, numbers and dash';
  }
  if (domain && domain.length > 62) {
    errors.domain = 'Domain name should be less than 62 characters';
  }

  if (!_.isEmpty(errors)) {
    toggleAvailable(false);
  }

  return !_.isEmpty(errors) ? errors : verifyAddress(props);
};
