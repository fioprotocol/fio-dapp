import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import { cartItems } from '../../redux/cart/selectors';
import { registrationResult } from '../../redux/registrations/selectors';
import PurchasePage from './PurchasePage';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    registrationResult,
  }),
);

export default withRouter(compose(reduxConnect)(PurchasePage));
