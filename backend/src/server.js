const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { ServiceBroker } = require("moleculer");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

// Moleculer broker
const broker = new ServiceBroker({ nodeID: "gateway", logger: true });
broker.loadService(path.join(__dirname, "./services/users.service.js"));

// Routes
const userRoutes = require("./routes/users.routes")(broker);
app.use("/", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start everything
broker.start().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
