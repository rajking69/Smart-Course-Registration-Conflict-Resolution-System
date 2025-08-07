import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const dbName = process.env.DB_NAME || 'smart_crs';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';

console.log('Database Config:', {
  name: dbName,
  user: dbUser,
  host: dbHost,
  // Don't log the actual password
  hasPassword: !!dbPassword
});

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});
