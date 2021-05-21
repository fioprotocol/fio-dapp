import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';

import CounterContainer from '../CounterContainer/CounterContainer';
import WalletDropdown from './WalletDropdown';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { recalculateCart } from '../../utils';

import classes from './Cart.module.scss';

const Cart = props => {
  const { cart, deleteItem, domains, userWallets, setWallet } = props;
  const count = cart.length;
  const isCartEmpty = count === 0;

  const handleDeleteItem = id => {
    const data = recalculateCart({ domains, cart, id }) || id;
    deleteItem(data);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <CounterContainer isEmpty={isCartEmpty}>{count}</CounterContainer>
        <h5 className={classes.title}>Cart</h5>
      </div>
      {!isCartEmpty &&
        cart.map(item => (
          <div key={item.domain + item.address}>
            <Badge show type={BADGE_TYPES.WHITE}>
              <div className={classes.itemContainer}>
                {item.address ? (
                  <span className={classes.address}>
                    <span className="boldText">{item.address}@</span>
                    <span>{item.domain}</span>
                  </span>
                ) : (
                  <span className="boldText">{item.domain && item.domain}</span>
                )}
                <p className={classes.price}>
                  <span className="boldText">
                    {!item.costFio
                      ? 'FREE'
                      : `${item.costFio.toFixed(2)}FIO (${item.costUsdc.toFixed(
                          2,
                        )} USDC)`}
                  </span>
                </p>
                <FontAwesomeIcon
                  icon="times-circle"
                  className={classes.icon}
                  onClick={() => handleDeleteItem(item.id)}
                />
              </div>
            </Badge>
            {item.showBadge && (
              <Badge show type={BADGE_TYPES.INFO}>
                <div className={classes.infoBadge}>
                  <FontAwesomeIcon
                    icon="exclamation-circle"
                    className={classes.infoIcon}
                  />
                  <p className={classes.infoText}>
                    <span className="boldText">Address Cost</span> - Your
                    account already has a free address associated with it.
                  </p>
                </div>
              </Badge>
            )}
          </div>
        ))}
      <Link to={ROUTES.FIO_ADDRESSES} className={classes.cta}>
        <div className={classes.ctaIconContainer}>
          <FontAwesomeIcon icon="search" className={classes.ctaIcon} />
        </div>
        <p className={classNames(classes.ctaText, 'boldText')}>
          Search for more FIO addresses?
        </p>
      </Link>
      <div className={classes.walletContainer}>
        <h6 className={classes.title}>FIO Wallet Assignment</h6>
        <p className={classes.subtitle}>
          Please choose which FIO wallet you would like these addresses assigned
          to.
        </p>
        <Form
          onSubmit={() => {}}
          render={() => (
            <form>
              <Field
                name="wallet"
                component={WalletDropdown}
                options={userWallets}
                setWallet={setWallet}
              />
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default Cart;
