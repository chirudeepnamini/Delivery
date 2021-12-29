const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  type: String,
});
module.exports = mongoose.model("Users", userSchema);
