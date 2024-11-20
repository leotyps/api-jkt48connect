const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Import middleware untuk validasi API key

const router = express.Router();

// Endpoint untuk mengambil data event
router.get("/", validateApiKey, async (req, res) => {
  try {
    const response = await axios.get("https://api.crstlnz.my.id/api/event");

    // Mengembalikan data dalam bentuk JSON
    res.json({
      success: true,
      author: "Valzyy",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching event data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data event.",
      error: error.message,
    });
  }
});

module.exports = router;
