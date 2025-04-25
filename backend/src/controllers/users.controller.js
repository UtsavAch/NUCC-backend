module.exports = (broker) => ({
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await broker.call("users.create", {
        username,
        email,
        password,
      });
      res.status(201).json({ username: user.username, email: user.email });
    } catch (err) {
      res.status(err.code || 500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await broker.call("users.login", { username, password });
      res.json({ username: user.username, email: user.email });
    } catch (err) {
      res.status(err.code || 401).json({ error: "Authentication failed" });
    }
  },

  async getUser(req, res) {
    try {
      const user = await broker.call("users.get", {
        username: req.params.username,
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const updates = {};
      if (req.body.email) updates.email = req.body.email;
      if (req.body.password) updates.password = req.body.password;

      const user = await broker.call("users.update", {
        username: req.params.username,
        ...updates,
      });

      res.json({ username: user.username, email: user.email });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      await broker.call("users.remove", { username: req.params.username });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listUsers(req, res) {
    try {
      const users = await broker.call("users.list");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
});
