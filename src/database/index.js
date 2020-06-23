import Sequelize from 'sequelize';

import Subscriber from '../app/models/Subscriber';
import User from '../app/models/User';
import File from '../app/models/File';
import Customer from '../app/models/Customer';
import ServiceOrder from '../app/models/ServiceOrder';

import databaseConfig from '../config/database';

const models = [Subscriber, User, File, Customer, ServiceOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
