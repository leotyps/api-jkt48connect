const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const qrisDinamis = require("qris-dinamis"); // Import modul qris-dinamis
const path = require("path");
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
    // Membuat QRIS sebagai file
    const result = qrisDinamis.makeFile(qris, {
      nominal: amount,
      path: `output/qris-${Date.now()}.png`, // Nama file dinamis berdasarkan timestamp
    });

    // Menyusun path file
    const filePath = path.resolve(result.path);

    // Menyusun respons
    res.json({
      author: "Valzyy",
      message: "QRIS berhasil dibuat.",
      filePath,
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
