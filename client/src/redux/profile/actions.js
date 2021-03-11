export const prefix = 'profile';

export const PROFILE_REQUEST = `${prefix}/PROFILE_REQUEST`;
export const PROFILE_SUCCESS = `${prefix}/PROFILE_SUCCESS`;
export const PROFILE_FAILURE = `${prefix}/PROFILE_FAILURE`;

export const loadProfile = () => ({
  types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
  promise: api => api.auth.profile(),
});

export const EDGE_CONTEXT_SUCCESS = `${prefix}/EDGE_CONTEXT_SUCCESS`;

export const setEdgeContext = edgeContext => ({
  type: EDGE_CONTEXT_SUCCESS,
  data: edgeContext
});

export const ACCOUNT_SUCCESS = `${prefix}/ACCOUNT_SUCCESS`;

export const setAccount = account => ({
  type: ACCOUNT_SUCCESS,
  data: account
});
// export const EDGE_LOGIN_REQUEST = `${prefix}/EDGE_LOGIN_REQUEST`;
// export const EDGE_LOGIN_SUCCESS = `${prefix}/EDGE_LOGIN_SUCCESS`;
// export const EDGE_LOGIN_FAILURE = `${prefix}/EDGE_LOGIN_FAILURE`;
//
// export const edgeLogin = ({ email, password }) => ({
//   types: [EDGE_LOGIN_REQUEST, EDGE_LOGIN_SUCCESS, EDGE_LOGIN_FAILURE],
//   promise: api => api.edge.login(email, password),
// });
export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({ email, password }) => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: api => api.auth.login(email, password),
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;

export const signup = data => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: api => api.auth.signup(data),
});

export const resetSuccessState = () => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = () => ({
  types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
  promise: api => api.auth.logout(),
});

export const CONFIRM_REQUEST = `${prefix}/CONFIRM_REQUEST`;
export const CONFIRM_SUCCESS = `${prefix}/CONFIRM_SUCCESS`;
export const CONFIRM_FAILURE = `${prefix}/CONFIRM_FAILURE`;

export const confirm = hash => ({
  types: [CONFIRM_REQUEST, CONFIRM_SUCCESS, CONFIRM_FAILURE],
  promise: api => api.auth.confirm(hash),
});

export const PASSWORD_RECOVERY_REQUEST = `${prefix}/PASSWORD_RECOVERY_REQUEST`;
export const PASSWORD_RECOVERY_SUCCESS = `${prefix}/PASSWORD_RECOVERY_SUCCESS`;
export const PASSWORD_RECOVERY_FAILURE = `${prefix}/PASSWORD_RECOVERY_FAILURE`;

export const passwordRecovery = ({ email }) => ({
  types: [
    PASSWORD_RECOVERY_REQUEST,
    PASSWORD_RECOVERY_SUCCESS,
    PASSWORD_RECOVERY_FAILURE,
  ],
  promise: api => api.auth.resetPassword(email),
});

export const RESET_PASSWORD_REQUEST = `${prefix}/RESET_PASSWORD_REQUEST`;
export const RESET_PASSWORD_SUCCESS = `${prefix}/RESET_PASSWORD_SUCCESS`;
export const RESET_PASSWORD_FAILURE = `${prefix}/RESET_PASSWORD_FAILURE`;

export const resetPassword = ({ hash, password, confirmPassword }) => ({
  types: [
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
  ],
  promise: api => api.auth.setPassword(hash, password, confirmPassword),
});
