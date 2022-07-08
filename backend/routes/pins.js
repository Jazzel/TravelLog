const router = require("express").Router();
const Pin = require("../models/Pin");

// ? Create a new pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);

  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ? Get all pins

module.exports = router;
