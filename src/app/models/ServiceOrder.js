import Sequelize, { Model } from 'sequelize';

class ServiceOrder extends Model {
  static FIELDS = [
    'id',
    'subscriber_id',
    'order_number',
    'order_date',
    'customer_id',
    'support_id',
    'problem_description',
    'solution_description',
    'warranty_date',
    'review_date',
    'parts_value',
    'total_value'
  ];

  static init(sequelize) {
    super.init(
      {
        subscriber_id: Sequelize.INTEGER,
        order_number: Sequelize.STRING,
        order_date: Sequelize.DATE,
        customer_id: Sequelize.INTEGER,
        support_id: Sequelize.INTEGER,
        problem_description: Sequelize.STRING,
        solution_description: Sequelize.STRING,
        warranty_date: Sequelize.DATE,
        review_date: Sequelize.DECIMAL,
        parts_value: Sequelize.DECIMAL,
        total_value: Sequelize.DECIMAL,
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
    this.belongsTo(models.User, {
      foreignKey: 'support_id',
      as: 'user',
    });
  }
}

export default ServiceOrder;
