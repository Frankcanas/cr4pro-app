import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Event extends Model {
  public id!: number;
  public name!: string;
  public date!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);

export default Event;
