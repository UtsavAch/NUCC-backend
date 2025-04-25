const { MoleculerError } = require("moleculer").Errors;
const UsersRepository = require("../repositories/users.repository");
const { hashPassword, comparePassword } = require("../helpers/password.helper");

module.exports = {
  name: "users",
  actions: {
    // Register
    async create(ctx) {
      const { username, email, password } = ctx.params;
      const repo = new UsersRepository();

      // Validation (may be we can put it in validators)
      if (!username || !email || !password)
        throw new MoleculerError("Missing fields", 400);
      if (password.length < 6)
        throw new MoleculerError("Password too short", 400);

      // Check existing user
      const existsUsername = await repo.findByUsername(username);
      const existsEmail = await repo.findByEmail(email);
      if (existsUsername || existsEmail)
        throw new MoleculerError("Username and/or email already exists", 400);

      // Hash password & create
      const hashed = await hashPassword(password);
      return repo.create({ username, email, password: hashed });
    },

    // Login
    async login(ctx) {
      const { username, password } = ctx.params;
      const repo = new UsersRepository();

      const user = await repo.findByUsername(username);
      if (!user) throw new MoleculerError("User not found", 404);

      const isValid = await comparePassword(password, user.password);
      if (!isValid) throw new MoleculerError("Invalid password", 401);

      return user;
    },

    async get(ctx) {
      const repo = new UsersRepository();
      const user = await repo.findByUsername(ctx.params.username);
      if (!user) throw new MoleculerError("User not found", 404);
      return user;
    },

    async list() {
      const repo = new UsersRepository();
      const users = await repo.list();
      if (!users) throw new MoleculerError("Failed to retrieve users", 500);
      return users;
    },

    async update(ctx) {
      const repo = new UsersRepository();
      const updates = {};
      if (ctx.params.email) updates.email = ctx.params.email;
      if (ctx.params.password)
        updates.password = await hashPassword(ctx.params.password);

      return repo.update(ctx.params.username, updates);
    },

    async remove(ctx) {
      const repo = new UsersRepository();
      await repo.delete(ctx.params.username);
      return { success: true };
    },
  },
};
