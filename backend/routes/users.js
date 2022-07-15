const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");

// ? register a new user
router.post("/register", async (req, res) => {
  try {
    // * generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // * create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // * save user and send response
    const savedUser = await newUser.save();
    res.status(200).json(savedUser._id);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ? login a user
router.post("/login", async (req, res) => {
  try {
    // * find user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    // * validate password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json("Invalid credentials");
    }

    // * send response
    return res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
