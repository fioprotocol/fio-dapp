import { combineReducers } from 'redux';
import { REFRESH_FIO_WALLETS_SUCCESS } from '../edge/actions';
import * as actions from './actions';

const emptyWallet = {
  id: '',
  name: '',
  publicKey: '',
  balance: 0,
};

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.REFRESH_BALANCE_REQUEST:
        return true;
      case actions.REFRESH_BALANCE_SUCCESS:
      case actions.REFRESH_BALANCE_FAILURE:
        return false;
      default:
        return state;
    }
  },
  fioWallets(state = [], action) {
    switch (action.type) {
      case REFRESH_FIO_WALLETS_SUCCESS: {
        const fioWallets = [...state];

        for (const fioWallet of action.data) {
          if (fioWallets.find(item => item.id === fioWallet.id)) continue;
          fioWallets.push({
            ...emptyWallet,
            id: fioWallet.id,
            publicKey: fioWallet.publicWalletInfo.keys.publicKey,
            name: fioWallet.name,
          });
        }
        return fioWallets;
      }
      case actions.REFRESH_BALANCE_SUCCESS: {
        return state.map(fioWallet =>
          fioWallet.publicKey === action.publicKey
            ? {
                ...fioWallet,
                balance: action.data,
              }
            : fioWallet,
        );
      }
      default:
        return state;
    }
  },
  fioAddresses(state = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS: {
        const fioAddresses = [...state];
        for (const item of action.data.fio_addresses) {
          const fioAddress = {
            name: item.fio_address,
            expiration: item.expiration,
          };
          const index = fioAddresses.findIndex(
            ({ name }) => name === fioAddress.name,
          );
          if (index < 0) {
            fioAddresses.push(fioAddress);
            continue;
          }
          fioAddresses[index] = fioAddress;
        }
        return fioAddresses;
      }
      default:
        return state;
    }
  },
  fioDomains(state = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS: {
        const fioDomains = [...state];
        for (const item of action.data.fio_domains) {
          const fioDomain = {
            name: item.fio_domain,
            expiration: item.expiration,
            isPublic: item.is_public,
          };
          const index = fioDomains.findIndex(
            ({ name }) => name === fioDomain.name,
          );
          if (index < 0) {
            fioDomains.push(fioDomain);
            continue;
          }
          fioDomains[index] = fioDomain;
        }
        return fioDomains;
      }
      default:
        return state;
    }
  },
});
