import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import { resetSuccessState, login } from '../../redux/profile/actions';
import { setAccount } from '../../redux/edge/actions';
import { showLoginModal } from '../../redux/modal/actions';
import {
  successfullyRegistered,
  loading as serverSignUpLoading,
} from '../../redux/profile/selectors';
import { signup } from '../../redux/profile/actions';
import { loading } from '../../redux/edge/selectors';
import { withRouter } from 'react-router-dom';
import CreateAccountForm from './CreateAccountForm';

const signupSuccess = createSelector(successfullyRegistered, f => f);

const selector = createStructuredSelector({
  serverSignUpLoading,
  signupSuccess,
  loading,
});

const actions = {
  onSubmit: signup,
  resetSuccessState,
  showLoginModal,
  setAccount,
  login,
};

const reduxConnect = connect(selector, actions);

export { CreateAccountForm };

export default withRouter(compose(reduxConnect)(CreateAccountForm));
