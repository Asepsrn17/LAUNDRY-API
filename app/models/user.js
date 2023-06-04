"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, {
        through: "userRoles",
        foreignKey: "userId",
        otherKey: "roleId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      hooks: {
        afterCreate: async (user, options) => {
          console.log("==>>> user afterCreate", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Users",
              task: "Insert",
              description: `Process Insert dengan data ${JSON.stringify(
                user.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },

        afterUpdate: async (user, options) => {
          console.log("==>>> user afterUpdate", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Users",
              task: "Update",
              description: `Process update user dengan data ${JSON.stringify(
                user.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },

        afterDestroy: async (user, options) => {
          console.log("==>>> user afterDelete", sequelize?.models);
          try {
            await sequelize.models.Auditlogs.create({
              tableName: "Users",
              task: "Delete",
              description: `Process hapus user dengan data ${JSON.stringify(
                user.toJSON()
              )}`,
            });
          } catch (err) {
            console.log(err);
          }
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
