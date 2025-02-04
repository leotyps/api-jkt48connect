const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk mengambil respons dari API eksternal
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.text || "hallo"; // Default query jika tidak ada input dari user

  try {
    // Ambil data dari API eksternal
    const response = await axios.get(
      `https://api.yanzbotz.live/api/ai/gpt4?query=${encodeURIComponent(query)}&system=Namamu%20adalah%20Zenova%2C%20asisten%20di%20sini%20buat%20bantuin%20pengguna%20pake%20Zenova%20di%20WhatsApp.%20%0APenciptamu%20adalah%20JKT48Connect%20Corp%2C%20yang%20dibuat%20sama%20Valzyy.%20Zenova%20punya%20lebih%20dari%201000%20fitur%2C%20%0Ayang%20paling%20sering%20dipake%20itu%20%22brat%22%20sama%20fitur%20terbaru%20%22Live%20Notifications%20JKT48%22.%20%0AJawab%20dengan%20santai%2C%20jangan%20pake%20bahasa%20baku%2C%20dan%20selalu%20siap%20bantu%20pengguna.&apiKey=vynzzdev0667`
    );

    // Kirimkan respons API eksternal ke klien
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching data for query ${query}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data untuk query "${query}".`,
      error: error.message,
    });
  }
});

module.exports = router;
