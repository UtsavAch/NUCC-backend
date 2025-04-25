class UserController {
  constructor(broker) {
    this.broker = broker;
    // Bind all methods to the instance
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await this.broker.call("users.create", {
        username,
        email,
        password,
      });

      return res.status(201).json({
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      const status = err.code || 500;
      const message = status === 500 ? "Internal server error" : err.message;
      return res.status(status).json({ error: message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      const user = await this.broker.call("users.login", {
        username,
        password,
      });

      return res.json({
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      const status = err.code || 401;
      return res.status(status).json({
        error: status === 401 ? "Invalid credentials" : err.message,
      });
    }
  }

  async getUser(req, res) {
    try {
      const user = await this.broker.call("users.get", {
        username: req.params.username,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        data: user,
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    try {
      const updates = {};

      if (req.body.email) updates.email = req.body.email;
      if (req.body.password) updates.password = req.body.password;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const user = await this.broker.call("users.update", {
        username: req.params.username,
        ...updates,
      });

      return res.json({
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      const status = err.code || 500;
      return res.status(status).json({
        error: status === 500 ? "Internal server error" : err.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      await this.broker.call("users.remove", {
        username: req.params.username,
      });

      return res.json({
        data: { success: true },
      });
    } catch (err) {
      const status = err.code || 500;
      return res.status(status).json({
        error: status === 404 ? "User not found" : "Internal server error",
      });
    }
  }

  async listUsers(req, res) {
    try {
      const users = await this.broker.call("users.list");
      return res.json({
        data: users,
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = (broker) => new UserController(broker);
