"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class mst_join extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      mst_join.belongsTo(models.User, {
        foreignKey: "userId",
        as: "joinUser",
      });
    }
  }
  mst_join.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tanggal_masuk: DataTypes.DATE,
      tanggal_selesai: DataTypes.DATE,
      penerima: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "mst_join",
    }
  );
  return mst_join;
};
