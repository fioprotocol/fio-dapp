import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/router/selectors';
import { loadProfile, logout } from '../../redux/profile/actions';
import { user } from '../../redux/profile/selectors';
import { account, loginSuccess } from '../../redux/edge/selectors';

import MainLayout from './MainLayout';

const selector = createStructuredSelector({
  pathname,
  user,
  account,
  loginSuccess,
});

const actions = {
  init: loadProfile,
  logout,
};

export { MainLayout };

export default connect(
  selector,
  actions,
)(MainLayout);
