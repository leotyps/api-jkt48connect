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

// Endpoint untuk mengambil gambar berdasarkan query
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.q || "ini brat"; // Query default adalah "default"

  try {
    // Ambil data gambar dari API eksternal
    const response = await axios.get(`https://tiodevhost.eu.org/?q=${query}`, {
      responseType: "arraybuffer", // Mendapatkan data sebagai buffer
    });

    const contentType = response.headers["content-type"]; // Ambil header Content-Type dari API eksternal

    // Kirimkan gambar langsung ke klien
    res.set("Content-Type", contentType); // Set header Content-Type
    res.send(response.data); // Kirimkan buffer gambar
  } catch (error) {
    console.error(`Error fetching image for query ${query}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil gambar untuk query ${query}.`,
      error: error.message,
    });
  }
});

module.exports = router;
