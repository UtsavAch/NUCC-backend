const { Users } = require("../database/index");

class UsersRepository {
  async create(userData) {
    return Users.create(userData);
  }

  async findByUsername(username) {
    return Users.findOne({ where: { username } });
  }

  async findByEmail(email) {
    return Users.findOne({ where: { email } });
  }

  async list() {
    return Users.findAll();
  }

  async update(username, updates) {
    const user = await this.findByUsername(username);
    if (!user) throw new Error("User not found");
    return user.update(updates);
  }

  async delete(username) {
    const user = await this.findByUsername(username);
    if (!user) throw new Error("User not found");
    await user.destroy();
    return { success: true };
  }
}

module.exports = UsersRepository;
