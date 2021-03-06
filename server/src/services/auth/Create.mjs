import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { User, Nonce, Wallet } from '../../models';

const EXPIRATION_TIME = 1000 * 60 * 30;

export default class AuthCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            signature: ['string'],
            challenge: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { email, signature, challenge } }) {
    const user = await User.findOneWhere({ email });

    if (!user) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
        },
      });
    }

    const wallets = await Wallet.list({ userId: user.id });
    let verified = false;
    for (const wallet of wallets) {
      verified = User.verify(challenge, wallet.publicKey, signature);
      if (verified) break;
    }

    if (!verified) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          signature: 'INVALID',
        },
      });
    }

    const nonce = await Nonce.findOne({
      where: {
        email,
        value: challenge,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!nonce || nonce.value !== challenge || Nonce.isExpired(nonce.createdAt)) {
      nonce && Nonce.isExpired(nonce.createdAt) && (await nonce.destroy());
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          challenge: 'INVALID',
        },
      });
    }
    await nonce.destroy();

    // todo: do we need STATUS check?
    if (user.status !== User.STATUS.ACTIVE) {
      throw new X({
        code: 'NOT_ACTIVE_USER',
        fields: {
          status: 'NOT_ACTIVE_USER',
        },
      });
    }

    const now = new Date();
    return {
      data: {
        jwt: generate({ id: user.id }, new Date(EXPIRATION_TIME + now.getTime())),
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.pin'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
