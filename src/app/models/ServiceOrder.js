import Sequelize, { Model } from 'sequelize';

class ServiceOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        subscriber_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
        customer_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  }
}

export default ServiceOrder;
