import apis from '../../api/index';
import {
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
} from '../../constants/common';
import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

export const usernameAvailable = async (
  username: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = await apis.edge.usernameAvailable(username);

    if (!res) {
      result.error = 'Not available';
    }
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const emailAvailable = async (
  email: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = await apis.auth.available(email);

    if (!res || res.error) {
      result.error = 'Not available';
    }
  } catch (e) {
    result.error = e.message || 'Not available';
  }

  return result;
};

export const checkPassword = async (
  password: string,
  passwordRepeat: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = await apis.edge.checkPasswordRules(password, passwordRepeat);

    if (!res) {
      result.error = 'Password is invalid';
    }
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const checkUsernameAndPassword = async (
  username: string,
  password: string,
  passwordRepeat: string,
): Promise<{ errors: { email?: string; password?: string } }> => {
  const result: { errors: { email?: string; password?: string } } = {
    errors: {},
  };
  const { error: usernameError } = await usernameAvailable(username);
  const { error: passwordError } = await checkPassword(
    password,
    passwordRepeat,
  );
  if (usernameError) {
    result.errors.email = usernameError;
  }
  if (passwordError) {
    result.errors.password = passwordError;
  }

  return result;
};

type CreateAccountRes = {
  errors: { email?: string };
  account?: EdgeAccount;
  fioWallet?: EdgeCurrencyWallet;
};
export const createAccount = async (
  username: string,
  password: string,
  pin: string,
): Promise<CreateAccountRes> => {
  const result: CreateAccountRes = { errors: {} };
  try {
    result.account = await apis.edge.signup(username, password, pin);
    const fioWallet = await result.account.createCurrencyWallet(
      FIO_WALLET_TYPE,
      DEFAULT_WALLET_OPTIONS,
    );
    await fioWallet.renameWallet(DEFAULT_WALLET_OPTIONS.name);
    result.fioWallet = fioWallet;
  } catch (e) {
    console.log(e);
    result.errors = { email: e.message };
  }

  return result;
};
