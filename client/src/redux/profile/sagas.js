import { put, takeEvery } from 'redux-saga/effects';
import {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  LOGOUT_SUCCESS,
  SET_RECOVERY_SUCCESS,
  loadProfile,
} from './actions';

import { closeRecoveryModal } from '../modal/actions';
import { ROUTES } from '../../constants/routes';

export function* loginSuccess(history, api) {
  yield takeEvery(LOGIN_SUCCESS, function*(action) {
    api.client.setToken(action.data.jwt);
    yield put(loadProfile());
    yield history.push(ROUTES.DASHBOARD);
  });
}

export function* signupSuccess() {
  yield takeEvery(SIGNUP_SUCCESS, function*() {});
}

export function* logoutSuccess(history, api) {
  yield takeEvery(LOGOUT_SUCCESS, function() {
    api.client.removeToken();
    history.push(ROUTES.HOME);
    window.location.reload();
  });
}

export function* setRecoverySuccess() {
  yield takeEvery(SET_RECOVERY_SUCCESS, function*() {
    yield put(closeRecoveryModal());
  });
}
