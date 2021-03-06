import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static FIELDS = [
    'id',
    'subscriber_id',
    'name',
    'document',
    'inscription',
    'email',
    'telephone',
    'zip_code',
    'street',
    'number',
    'neighborhood',
    'city',
    'state',
    'complement',
  ];

  static SINGLE_FIELDS = ['id', 'name'];

  static init(sequelize) {
    super.init(
      {
        subscriber_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        document: Sequelize.STRING,
        inscription: Sequelize.STRING,
        email: Sequelize.STRING,
        telephone: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        complement: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Customer;
