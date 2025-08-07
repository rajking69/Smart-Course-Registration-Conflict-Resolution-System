import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Course extends Model {
  public id!: number;
  public code!: string;
  public name!: string;
  public description!: string;
  public credits!: number;
  public capacity!: number;
  public schedule!: string;
  public prerequisites?: string[];
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Course',
  }
);

export default Course;
