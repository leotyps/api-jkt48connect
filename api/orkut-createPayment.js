const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const qrisDinamis = require("qris-dinamis"); // Import modul qris-dinamis
const app = express();
const router = express.Router();

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS
router.get("/", validateApiKey, async (req, res) => {
  const { amount, qris, logostore } = req.query; // Mengambil parameter query

  // Validasi parameter wajib
  if (!amount || !qris) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'qris' harus disertakan.",
    });
  }

  try {
    // Opsi untuk membuat QRIS
    const options = {
      nominal: amount,
    };

    // Tambahkan opsi path jika logostore disediakan
    if (logostore) {
      options.path = `output/${encodeURIComponent(logostore)}.jpg`;
    }

    // Membuat file QRIS
    const result = qrisDinamis.makeFile(qris, options);

    // Menyusun respons
    res.json({
      author: "Valzyy",
      message: "QRIS berhasil dibuat.",
      filePath: result.path || null, // Path file jika disediakan
      base64: result.base64 || null, // Base64 jika tersedia
    });
  } catch (error) {
    console.error("Error creating QRIS:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat QRIS.",
      error: error.message,
    });
  }
});

module.exports = router;
