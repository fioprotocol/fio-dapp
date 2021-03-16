import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { library } from '@fortawesome/fontawesome-svg-core';
import { addLocationQuery } from './helpers/routeParams';

import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCog,
  faBell,
  faCircle,
  faShoppingCart,
  faTimesCircle,
  faInfoCircle,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import api from './api';
import configureStore from './redux/store';

import Routes from './routes';

const history = createHistory();

addLocationQuery(history);

history.listen(() => addLocationQuery(history));

library.add(
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCog,
  faBell,
  faCircle,
  faShoppingCart,
  faTimesCircle,
  faInfoCircle,
  faBan,
);

const store = configureStore(api, history);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}
