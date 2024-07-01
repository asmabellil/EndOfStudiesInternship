import { initUser } from '@components/user/user.model';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_CONNECT_STRING
} = process.env;


// Create a new Sequelize instance
const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'oracle',  // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  dialectOptions: {
    connectString: DB_CONNECT_STRING
  }
});

// Initialize models
const User = initUser(sequelize);

// Add associations if any
if (User.associate) {
  User.associate(sequelize.models);
}

export { sequelize, User };