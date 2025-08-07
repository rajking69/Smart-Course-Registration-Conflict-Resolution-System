"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from the root .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../.env') });
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
exports.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
});
