const express = require("express");
const cors = require("cors");
const { ServiceBroker } = require("moleculer");
const path = require("path");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;

const broker = new ServiceBroker({
  nodeID: "gateway",
  logger: true,
  logLevel: "info",
});

// Load user service
broker.loadService(path.join(__dirname, "./services/users.service.js"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

broker
  .start()
  .then(() => {
    console.log("Moleculer service broker started");

    ////////////// USER ENDPOINTS //////////////

    // Register new user
    app.post("/register", async (req, res) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await broker.call("users.create", {
          username,
          email,
          password,
        });
        res.status(201).json({
          username: user.username,
          email: user.email,
          password: user.password,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        res.status(err.code || 500).json({
          error: err.message,
          details: err.data,
        });
      }
    });

    // User login
    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "Missing credentials" });
        }

        const user = await broker.call("users.login", { username, password });
        res.json({
          username: user.username,
          email: user.email,
          password: user.password,
        });
      } catch (err) {
        res.status(err.code || 401).json({
          error: "Authentication failed",
          details: err.message,
        });
      }
    });

    // Get user profile
    app.get("/users/:username", async (req, res) => {
      try {
        const user = await broker.call("users.get", {
          username: req.params.username,
        });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({
          username: user.username,
          email: user.email,
          password: user.password,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        res.status(err.code || 500).json({ error: err.message });
      }
    });

    // Update user
    //If we want to authenticate user by password before updating, we can use login to authenticate
    app.put("/users/:username", async (req, res) => {
      try {
        const updates = {};
        if (req.body.email) updates.email = req.body.email;
        if (req.body.password) updates.password = req.body.password;

        if (Object.keys(updates).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const user = await broker.call("users.update", {
          username: req.params.username,
          ...updates,
        });

        res.json({
          username: user.username,
          email: user.email,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        res.status(err.code || 500).json({ error: err.message });
      }
    });

    // Delete user
    app.delete("/users/:username", async (req, res) => {
      try {
        await broker.call("users.remove", {
          username: req.params.username,
        });
        res.json({
          success: true,
          message: `User ${req.params.username} deleted successfully`,
        });
      } catch (err) {
        res.status(err.code || 500).json({ error: err.message });
      }
    });

    // List all users
    app.get("/users", async (req, res) => {
      try {
        const users = await broker.call("users.list");
        res.json(
          users.map((user) => ({
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: new Date().toISOString(),
          }))
        );
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Broker failed to start:", err);
    process.exit(1);
  });
