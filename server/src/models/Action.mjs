import Sequelize from 'sequelize';
import crypto from 'crypto';

import { User } from './';
import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Action extends Base {
  static get TYPE() {
    return {
      CONFIRM_EMAIL: 'confirmEmail',
      RESET_PASSWORD: 'resetPassword',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        hash: { type: DT.STRING, allowNull: false, unique: true },
        type: { type: DT.ENUM, values: Object.values(this.TYPE) },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'actions',
      },
    );
  }

  run(data) {
    return this[this.type](data);
  }

  async confirmEmail() {
    const user = await User.findById(this.data.userId);

    return user.update({ status: User.STATUS.ACTIVE });
  }

  async resetPassword(externalData) {
    const user = await User.findById(this.data.userId);

    user.password = externalData.password;

    return user.save();
  }

  static generateHash() {
    return crypto.randomBytes(20).toString('hex');
  }
}
