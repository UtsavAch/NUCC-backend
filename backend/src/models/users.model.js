const { DataTypes } = require("sequelize");

function UsersModel(sequelize) {
  return sequelize.define(
    "users",
    {
      username: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
    },
    {
      // schema: "project_db",
      tableName: "users",
      timestamps: false,
    }
  );
}

module.exports = UsersModel;
