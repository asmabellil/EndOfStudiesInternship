import { initUser } from '@components/user/user.model';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import config from '@config/config';

dotenv.config(); // Load environment variables from .env file


// Create a new Sequelize instance
/* const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'oracle',  // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  dialectOptions: {
    connectString: DB_CONNECT_STRING
  }
}); */

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

// Add associations if any
if (User.associate) {
  User.associate(sequelize.models);
}

export { sequelize, User };