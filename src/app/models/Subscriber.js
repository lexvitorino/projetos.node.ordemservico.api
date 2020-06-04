import Sequelize, { Model } from 'sequelize';

class Subscriber extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Subscriber;
