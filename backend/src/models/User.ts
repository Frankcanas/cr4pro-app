import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public fullName!: string;
  public age!: number;
  public motorcycleModel!: string;
  public cylinderCapacity!: number;
  public documentId!: string;
  public licensePlate!: string;
  public role!: string;
  public password?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motorcycleModel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Cr4',
    },
    cylinderCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[125, 150, 200, 250]],
      },
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('Aspirantes', 'Pilotos', 'Lideres'),
      allowNull: false,
      defaultValue: 'Aspirantes',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;
