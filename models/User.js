import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const User = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// generating a token here

User.methods.generateAuthToken = async function () {
  try {
    // sign(=> payload, secretkey(32char suggested))
    let token = jwt.sign(
      { _id: this._id },
      "MYNAMEISFAIZANALIKHANMERNDEVELOPER"
    );
    // adding token into our tokens
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default mongoose.model("user", User);
