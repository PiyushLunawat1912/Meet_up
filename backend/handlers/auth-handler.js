const UserAuth = require("./../db/user");

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

async function signupUser(model) {
    console.log(model);
    
      const exists = await UserAuth.findOne({ email: model.email });

      if (exists) {
        return { message: "Email already exists" };
        }

    const hashPassword = await bcrypt.hash(model.password,10)
    let user = new UserAuth({
        name: model.name,
        email: model.email,
        password: hashPassword

    });
    await user.save()
}

async function loginUser(model) {
    const user = await UserAuth.findOne({ email: model.email });
    console.log("User found:", user);
    if (!user) return null

    const isValidPassword = await bcrypt.compare(model.password.trim(), user.password);
    console.log("Password match:", isValidPassword);

    if (isValidPassword) {
        const token = jwt.sign({ name: user.name, email: user.email }, "Piyush", { expiresIn: "2h" });
        return { token, user };
    } else {
        return null;
    }
}
module.exports = {signupUser, loginUser};