const express = require("express");
const cors = require("cors");
const { createPaymentQr } = require("saweria-createqr");
const validateApiKey = require("../middleware/auth");
const path = require("path"); // Untuk menentukan path tempat menyimpan file QR
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query;

  // Validasi parameter wajib
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Membuat QRIS menggunakan createPaymentQr dari saweria-createqr
    const result = await createPaymentQr(username, path, { amount, message });

    // Mengembalikan respons dengan URL hasil QR
    res.json({
      author: "Valzyy",
      message: "QRIS berhasil dibuat.",
      qrisUrl: result, // URL hasil QR yang dapat digunakan
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
