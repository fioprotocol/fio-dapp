import { prefix } from './actions';
import { createSelector } from 'reselect';

export const loading = state => state[prefix].loading;
export const user = state => state[prefix].user;
export const account = state => state[prefix].account;
export const edgeContext = state => state[prefix].edgeContext;
export const role = state => state[prefix].user && state[prefix].user.role;
export const isAdmin = state =>
  state[prefix].user && state[prefix].user.role === 'ADMIN';
export const error = state => state[prefix].error;
export const isConfirmed = state => state[prefix].isConfirmed;
export const isChangedPwd = state => state[prefix].isChangedPwd;
export const isRecoveryRequested = state => state[prefix].isRecoveryRequested;
export const successfullyRegistered = state =>
  state[prefix].successfullyRegistered;

export const isAuthenticated = createSelector(
  account,
  account => !!account,
);
