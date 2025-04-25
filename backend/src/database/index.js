const { Sequelize } = require("sequelize");
const UsersModel = require("../models/users.model");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
});

const Users = UsersModel(sequelize);

module.exports = {
  sequelize,
  Users,
};
