import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { deleteItem, recalculate } from '../../redux/cart/actions';
import { setRedirectPath } from '../../redux/router/actions';

import { cartItems } from '../../redux/cart/selectors';
import { account, isAuthenticated } from '../../redux/edge/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';
import { domains, prices } from '../../redux/registrations/selectors';

import AddressDomainCart from './AddressDomainCart';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    account,
    domains,
    prices,
    hasFreeAddress,
    isAuthenticated,
  }),
  {
    deleteItem,
    recalculate,
    setRedirectPath,
  },
);

export default withRouter(compose(reduxConnect)(AddressDomainCart));
