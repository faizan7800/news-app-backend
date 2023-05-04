import express from "express";
import cors from "cors";
import User from "./models/User.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
const mongoUrl = "mongodb://localhost/UsersData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
mongoose.connect(mongoUrl).then(console.log("connected to database"));
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.get("/", (req, res) => {
  res.status(200).send("Hello to News App!");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(500).json({ error: "Please fill the fields properly" });
  }

  try {
    const UserExist = await User.findOne({ email: email });
    if (UserExist) {
      return res.status(422).json({ error: "user already exists" });
    } else {
      const user = new User({ username, email, password });
      await user.save();
      res.status(201).json({ message: "user registred successfully" });
    }
  } catch (error) {}
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please fill the data fields" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (!isMatch) {
        res.status(400).json({ error: "Invalid login credentials" });
      } else {
        res.status(200).json({ message: "User signed in Successfully!" });
      }
    } else {
      res.status(400).json({ error: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(400).json({ error: "Error is coming" });
  }
});

app.listen(8000, (req, res) => {
  console.log(`port is started at 8000`);
});
