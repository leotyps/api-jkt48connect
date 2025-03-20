const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*',
}));

// Base URL untuk label dan URL
const BASE_URL = "https://jkt48.com";

// Endpoint untuk mengambil data event
router.get("/", validateApiKey, async (req, res) => {
  try {
    const response = await axios.get("https://api.crstlnz.my.id/api/event");

    // Mengekstrak hanya bagian "other_schedule" dan memodifikasi label & url
    const otherSchedule = (response.data.other_schedule || []).map(event => ({
      ...event,
      label: event.label ? `${BASE_URL}${event.label}` : null,
      url: event.url ? `${BASE_URL}${event.url}` : null
    }));

    // Mengembalikan data yang telah dimodifikasi
    res.json(otherSchedule);
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
