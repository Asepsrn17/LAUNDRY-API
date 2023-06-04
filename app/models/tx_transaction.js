"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tx_transaction extends Model {
    static associate(models) {
      // define association here
      tx_transaction.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userTransaction",
      });
      tx_transaction.belongsTo(models.mst_join, {
        foreignKey: "joinId",
        as: "joinTransaction",
      });
    }
  }
  tx_transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      joinId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pelayanan: DataTypes.STRING,
      jumlah: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
    },
    {
      hooks: {
        afterCreate: async (transaction, options) => {
          console.log("==>>> transaction afterCreate", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Transaction",
              task: "Insert",
              description: `Process transaksi dengan data ${JSON.stringify(
                transaction.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },

        afterUpdate: async (transaction, options) => {
          console.log("==>>> transaction afterUpdate", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Transaction",
              task: "Update",
              description: `Process update transaksi dengan data ${JSON.stringify(
                transaction.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },

        afterDestroy: async (transaction, options) => {
          console.log("==>>> transaction afterDelete", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Transaction",
              task: "Delete",
              description: `Process hapus transaksi dengan data ${JSON.stringify(
                transaction.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },
      },
      sequelize,
      modelName: "tx_transaction",
    }
  );
  return tx_transaction;
};
