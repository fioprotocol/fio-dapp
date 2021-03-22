import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/router/selectors';
import { loadProfile, logout } from '../../redux/profile/actions';
import { user } from '../../redux/profile/selectors';
import { account, loginSuccess, edgeContextSet } from '../../redux/edge/selectors';
import { edgeContextInit } from '../../redux/edge/actions';
import { showLogin, showRecovery } from '../../redux/modal/selectors';

import MainLayout from './MainLayout';

const selector = createStructuredSelector({
  pathname,
  user,
  account,
  loginSuccess,
  showLogin,
  showRecovery,
  edgeContextSet
});

const actions = dispatch => ({
  init: () => {
    dispatch(loadProfile())
    dispatch(edgeContextInit())
  },
  logout: () => dispatch(logout())
});

export { MainLayout };

export default connect(
  selector,
  actions,
)(MainLayout);
