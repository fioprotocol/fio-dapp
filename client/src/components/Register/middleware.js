import apis from '../../api/index';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

export const registerFree = async (fioName, publicKey) => {
  let result = {};
  try {
    const res = await apis.fioReg.register({ address: fioName, publicKey });

    if (!res) {
      throw new Error('Server Error');
    }
    result = { ...result, ...res, fioName, isFree: true };
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const register = async (fioName, costFio) => {
  let result = {};
  try {
    const res = await apis.fio.register(fioName, apis.fio.amountToSUF(costFio));

    if (!res) {
      throw new Error('Server Error');
    }

    result = { ...result, ...res, isFree: true };
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const executeRegistration = async (items, keys) => {
  const result = { errors: [], registered: [] };
  const registrations = [];
  if (keys.private) apis.fio.setWalletFioSdk(keys);
  try {
    for (const item of items) {
      const fioName = item.address
        ? `${item.address}${FIO_ADDRESS_DELIMITER}${item.domain}`
        : item.domain;
      if (item.costFio) {
        registrations.push(register(fioName, item.costFio));
      } else {
        registrations.push(registerFree(fioName, keys.public));
      }
    }
    const responses = await Promise.allSettled(registrations);
    for (const response of responses) {
      if (response.error) {
        result.errors.push(response.error);
      } else {
        result.registered.push(response);
      }
    }
  } catch (e) {
    console.log(e);
  }
  if (keys.private) apis.fio.clearWalletFioSdk();

  return result;
};
