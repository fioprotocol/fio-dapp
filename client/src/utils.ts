import isEmpty from 'lodash/isEmpty';
import apis from './api/index';
const FIO_DAPP_USERNAME_DELIMITER = '_fio.dapp_';

export const FIO_ADDRESS_DELIMITER = '@';

export function compose(...funcs: ((args?: any) => any)[]) {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function currentYear() {
  const year = new Date().getFullYear();
  const startYear = 2021;
  return year === startYear ? year : `${startYear} - ${year}`;
}

export function emailToUsername(email: string) {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.split('@');
    // return name
    return `${name}${FIO_DAPP_USERNAME_DELIMITER}${domain}`;
  }

  return '';
}

export function usernameToEmail(username: string) {
  if (username && username.indexOf(FIO_DAPP_USERNAME_DELIMITER) > 0) {
    const [name, domain] = username.split(FIO_DAPP_USERNAME_DELIMITER);
    // return name
    return `${name}@${domain}`;
  }

  return '';
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const setDataMutator = (args: any[], state: any) => {
  const [name, data] = args;
  const field = state.fields[name];

  if (field) {
    field.data = { ...field.data, ...data };
  }
};

type Domain = { domain: string; free?: boolean };
export const domainFromList = ({ domains, domain }: { domains: Domain[], domain: string }) =>
  domains.find(item => item.domain === domain) || {};

export const setFreeCart = ({ cartItems }) => {
  const recalcElem = cartItems.find(
    item => item.address && item.domain && item.allowFree,
  );
  if (recalcElem) {
    delete recalcElem.costFio;
    delete recalcElem.costUsdc;

    const retCart = cartItems.map(item => {
      delete item.showBadge;
      return item.id === recalcElem.id ? recalcElem : item;
    });
    return retCart;
  } else {
    return cartItems;
  }
};

export const recalculateCart = ({
  domains,
  cartItems,
  id,
}: {
  domains: any[];
  cartItems: any[];
  id: string;
}) => {
  const deletedElement = cartItems.find(item => item.id === id);
  if (!deletedElement) return;

  const data: any = {
    id,
  };

  const deletedElemCart = cartItems.filter(item => item.id !== id);

  if (!deletedElement.costUsdc && !deletedElement.costFio) {
    const recCart = setFreeCart({ domains, cartItems: deletedElemCart });
    data.cartItems = recCart;
  }

  return data;
};

export const removeFreeCart = ({
  cartItems,
  prices,
}: {
  cartItems: any[];
  prices: any;
}) => {
  const {
    fio: { address: addressFio },
    usdt: { address: addressUsdc },
  } = prices;

  const retCart = cartItems.map(item => {
    if (!item.costFio && !item.costUsdc) {
      item.costFio = addressFio;
      item.costUsdc = addressUsdc;
      item.showBadge = true;
    }
    return item;
  });
  return retCart;
};

export const cartHasFreeItem = (cartItems: any[]) => {
  return (
    !isEmpty(cartItems) &&
    cartItems.some(item => !item.costFio && !item.costUsdc)
  );
};

export const handleFreeAddressCart = ({
  domains,
  recalculate,
  cartItems,
  prices,
  hasFreeAddress,
}: {
  domains: any[];
  fioWallets: any[];
  recalculate: (cartItems: any[]) => {};
  cartItems: any[];
  prices: any;
  hasFreeAddress: boolean;
}) => {
  let retCart = [];
  if (hasFreeAddress) {
    retCart = removeFreeCart({ cartItems, prices });
  } else if (!cartHasFreeItem(cartItems)) {
    retCart = setFreeCart({ domains, cartItems });
  }
  recalculate(!isEmpty(retCart) ? retCart : cartItems);
};

export const deleteCartItem = ({
  id,
  prices,
  deleteItem,
  domains,
  cartItems,
  recalculate,
}: {
  id?: string;
  prices?: any;
  deleteItem?: (item: any) => {};
  domains?: any[];
  cartItems?: any[];
  recalculate?: (cartItems: any[]) => {};
} = {}) => {
  const data = recalculateCart({ domains, cartItems, id }) || id;
  deleteItem(data);

  const { domain, hasCustomDomain } =
    cartItems.find(item => item.id === id) || {};
  const updCart = cartItems.filter(item => item.id !== id);

  if (hasCustomDomain) {
    const hasCurrentDomain =
      domain && updCart.some(item => item.domain === domain.toLowerCase());
    if (hasCurrentDomain) {
      const firstMatchElem =
        (domain &&
          updCart.find(item => item.domain === domain.toLowerCase())) ||
        {};
      if (firstMatchElem) {
        const {
          usdt: { domain: domainPrice, address: addressPrice },
          fio: { domain: fioDomainPrice, address: fioAddressPrice },
        } = prices;
        const retObj = {
          ...firstMatchElem,
          costFio: parseFloat(fioAddressPrice) + parseFloat(fioDomainPrice),
          costUsdc: parseFloat(addressPrice) + parseFloat(domainPrice),
          hasCustomDomain: true,
        };
        const retData = updCart.map(item =>
          item.id === firstMatchElem.id ? retObj : item,
        );
        recalculate(retData);
      }
    }
  }
};

export const totalCost = (cart: any[]) => {
  if (cart.length === 1 && cart.some(item => !item.costFio && !item.costUsdc))
    return { costFree: 'FREE' };

  const cost =
    !isEmpty(cart) &&
    cart
      .filter(item => item.costFio && item.costUsdc)
      .reduce((acc, item) => {
        if (!acc.costFio) acc.costFio = 0;
        if (!acc.costUsdc) acc.costUsdc = 0;
        return {
          costFio: acc.costFio + item.costFio,
          costUsdc: acc.costUsdc + item.costUsdc,
        };
      }, {});

  return {
    costFio: (Number.isFinite(cost.costFio) && cost.costFio.toFixed(2)) || 0,
    costUsdc: (Number.isFinite(cost.costUsdc) && cost.costUsdc.toFixed(2)) || 0,
  };
};

export const isDomain = (fioName: string) =>
  fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const transformResult = ({
  result,
  cart,
  prices,
}: {
  result: any,
  cart: any[],
  prices: any,
}) => {
  const errItems = [];
  const regItems = [];

  const { registered, errors, partial } = result;

  const updatedCart = [...cart];

  const {
    fio: { address: addressCostFio, domain: domainCostFio },
    usdt: { address: addressCostUsdc, domain: domainCostUsdc },
  } = prices;

  if (!isEmpty(errors)) {
    for (const item of errors) {
      const { fioName, error, isFree, cartItemId } = item;

      const retObj: any = {
        id: fioName,
      };

      const partialIndex = partial && partial.indexOf(id => id === cartItemId);
      if (!isDomain(fioName)) {
        const name = fioName.split('@');
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;
        retObj.error = error;

        if (isFree) {
          retObj.isFree = isFree;
        } else {
          if (
            cart.find(item => item.id === cartItemId && item.hasCustomDomain) &&
            partialIndex < 0
          ) {
            retObj['costFio'] = addressCostFio + domainCostFio;
            retObj['costUsdc'] = addressCostUsdc + domainCostUsdc;
          } else {
            retObj.costFio = addressCostFio;
            retObj.costUsdc = addressCostUsdc;
          }
        }
      } else {
        retObj.domain = fioName;
        retObj.costFio = domainCostFio;
        retObj.costUsdc = domainCostUsdc;
      }

      errItems.push(retObj);
      if (partialIndex > 0) {
        updatedCart.splice(partialIndex, 1, retObj);
      }
    }
  }

  if (!isEmpty(registered)) {
    for (const item of registered) {
      const { fioName, isFree, fee_collected } = item;

      const retObj: any = {
        id: fioName,
      };

      if (!isDomain(fioName)) {
        const name = fioName.split('@');
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;

        if (isFree) {
          retObj.isFree = isFree;
        } else {
          retObj.costFio = apis.fio.sufToAmount(fee_collected);
          retObj.costUsdc =
            (apis.fio.sufToAmount(fee_collected) * addressCostUsdc) /
            addressCostFio;
        }
      } else {
        retObj.domain = fioName;
        retObj.costFio = apis.fio.sufToAmount(fee_collected);
        retObj.costUsdc =
          (apis.fio.sufToAmount(fee_collected) * domainCostUsdc) /
          domainCostFio;
      }

      regItems.push(retObj);

      for (let i = updatedCart.length - 1; i >= 0; i--) {
        if (updatedCart[i].id === fioName) {
          updatedCart.splice(i, 1);
        }
      }
    }
  }

  return { errItems, regItems, updatedCart };
};

export const priceToNumber = price => +parseFloat(price).toFixed(2);
