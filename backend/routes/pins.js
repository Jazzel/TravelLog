const router = require("express").Router();
const Pin = require("../models/Pin");

// ? Create a new pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);

  try {
    const savedPin = await newPin.save();
    return res.status(200).json(savedPin);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// ? Get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    return res.status(200).json(pins);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
