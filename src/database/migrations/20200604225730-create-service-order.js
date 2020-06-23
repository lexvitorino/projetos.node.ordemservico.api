module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('service_orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subscriber_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'subscribers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        allowNull: true,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        allowNull: true,
      },
      support_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        allowNull: true,
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      problem_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      solution_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      warranty_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      review_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      labor_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      parts_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      total_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('service_orders');
  },
};
