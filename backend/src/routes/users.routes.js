const express = require("express");

module.exports = (broker) => {
  const router = express.Router();
  const controller = require("../controllers/users.controller")(broker);

  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/users/:username", controller.getUser);
  router.put("/users/:username", controller.updateUser);
  router.delete("/users/:username", controller.deleteUser);
  router.get("/users", controller.listUsers);

  return router;
};
