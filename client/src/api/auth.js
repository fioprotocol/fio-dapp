import Base from './base';

export default class Auth extends Base {
  profile() {
    return this.apiClient.get('users/me');
  }

  login(email, password, pin) {
    return this.apiClient.post('auth', { data: { email, password, pin } });
  }

  signup(data) {
    return this.apiClient.post('users', { data });
  }

  confirm(hash) {
    return this.apiClient.post(`actions/${hash}`);
  }

  resetPassword(email) {
    return this.apiClient.post('users/resetPassword', { data: { email } });
  }

  setPassword(hash, password, confirmPassword) {
    return this.apiClient.post(`actions/${hash}`, {
      data: { password, confirmPassword },
    });
  }

  setRecovery(token) {
    return this.apiClient.post('users/setRecovery', { data: { token } });
  }

  async logout() {
    return null;
  }
}