const { MoleculerError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const bcrypt = require("bcrypt");

module.exports = {
  name: "users",
  mixins: [DbService],
  adapter: new SqlAdapter(process.env.DB_URL),

  model: {
    name: "Users",
    schema: "project_db",
    define: {
      username: {
        type: Sequelize.STRING(64),
        primaryKey: true,
      },
      password: Sequelize.STRING(64),
      email: {
        type: Sequelize.STRING(128),
        unique: true,
      },
    },
    timestamps: false,
  },

  async started() {
    await this.adapter.connect();
    this.adapter.model.schema("project_db");
  },

  actions: {
    // Create user
    async create(ctx) {
      const { username, email, password } = ctx.params;

      // Basic validation
      if (!username || !email || !password) {
        throw new MoleculerError("Missing required fields", 400);
      }
      if (password.length < 6) {
        throw new MoleculerError("Password too short (min 6 chars)", 400);
      }

      // Check duplicate username or email
      const exists = await this.adapter.model.findOne({
        where: {
          [Sequelize.Op.or]: [{ username }, { email }],
        },
      });
      if (exists) {
        throw new MoleculerError("Username or email already exists", 400);
      }

      // Hash password
      const hashedPass = await bcrypt.hash(password, 10);

      return this.adapter.model.create({
        username,
        email,
        password: hashedPass,
      });
    },

    // Login user
    async login(ctx) {
      const { username, password } = ctx.params;

      const user = await this.adapter.model.findOne({
        where: { username },
      });
      if (!user) throw new MoleculerError("User not found", 404);

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new MoleculerError("Wrong password", 401);

      return user;
    },

    // Get single user by username
    async get(ctx) {
      const user = await this.adapter.model.findOne({
        where: { username: ctx.params.username },
      });
      if (!user) throw new MoleculerError("User not found", 404);
      return user;
    },

    // List all users
    async list() {
      return this.adapter.model.findAll();
    },

    // Update user
    async update(ctx) {
      const user = await this.adapter.model.findOne({
        where: { username: ctx.params.username },
      });
      if (!user) throw new MoleculerError("User not found", 404);

      const updates = {};
      if (ctx.params.email) updates.email = ctx.params.email;
      if (ctx.params.password) {
        updates.password = await bcrypt.hash(ctx.params.password, 10);
      }

      return user.update(updates);
    },

    // Delete user
    async remove(ctx) {
      const user = await this.adapter.model.findOne({
        where: { username: ctx.params.username },
      });
      if (!user) throw new MoleculerError("User not found", 404);
      await user.destroy();
      return { success: true };
    },
  },
};
