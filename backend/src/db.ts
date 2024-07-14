import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import config from '@config/config';
import { initUser } from '@components/user/user.model';
import { initLeave } from '@components/leave/leave.model';

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    // logging: false,
  },
);

// Initialize models
const User = initUser(sequelize);
const Leave = initLeave(sequelize);

const models = {
  User,
  Leave,
};

// Establish associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, User, Leave };
