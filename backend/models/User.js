const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  password: String // hashed password if you're using authentication
});

module.exports = mongoose.model("User", UserSchema);
