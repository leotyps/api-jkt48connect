const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const qrisDinamis = require("qris-dinamis"); // Import modul qris-dinamis
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS
router.get("/", validateApiKey, async (req, res) => {
  const { amount, qris } = req.query; // Mengambil parameter query

  // Validasi parameter wajib
  if (!amount || !qris) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'qris' harus disertakan.",
    });
  }

  try {
    // Membuat QRIS dalam format Base64
    const result = qrisDinamis.makeFile(qris, {
      nominal: amount,
      base64: true,
    });

    // Pastikan hasil Base64 tersedia
    if (!result.base64) {
      return res.status(500).json({
        message: "Gagal menghasilkan QRIS dalam format Base64.",
      });
    }

    // Menyusun respons
    res.json({
      author: "Valzyy",
      message: "QRIS berhasil dibuat.",
      base64: result.base64,
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
