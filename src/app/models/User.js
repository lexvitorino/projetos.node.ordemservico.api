import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static FIELDS = [
    'id',
    'subscriber_id',
    'name',
    'email',
    'avatar_id',
    'permission',
  ];

  static SINGLE_FIELDS = ['id', 'name'];

  static init(sequelize) {
    super.init(
      {
        subscriber_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        password_lock: Sequelize.STRING,
        permission: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  checkPasswordLock(passwordLock) {
    return bcrypt.compare(passwordLock, this.password_lock);
  }
}

export default User;
