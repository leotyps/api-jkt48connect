const express = require("express");
const axios = require("axios");

const router = express.Router();

// Endpoint untuk mengambil data event
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.crstlnz.my.id/api/event");
    res.json({
      success: true,
      author: "Valzyy",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
