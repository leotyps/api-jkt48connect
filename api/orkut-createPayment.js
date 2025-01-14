// api/qr.js
const express = require("express");
const cors = require("cors");
const { createPaymentQr } = require('@sumshiiy/saweria-createqr'); // Mengimpor fungsi createPaymentQr
const validateApiKey = require("../middleware/auth"); // Middleware untuk validasi API Key
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*", // Mengizinkan semua origin
  })
);

// Endpoint untuk membuat QRIS menggunakan Saweria
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query;

  // Validasi parameter yang dibutuhkan
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Membuat QRIS menggunakan Saweria
    const result = await createPaymentQr(username, {
      amount: parseInt(amount), // Mengonversi amount menjadi integer
      message: message || "",    // Jika message kosong, gunakan string kosong
    });

    // Mengembalikan hasil QRIS dalam format JSON
    res.json({
      author: "@sumshiiy", // Nama author
      trx_id: result.trx_id, // ID transaksi
      message: result.message, // Pesan yang disertakan
      amount: result.amount, // Jumlah yang dibayar
      qr_string: result.qr_string, // String QRIS yang dihasilkan
      created_at: result.created_at, // Tanggal pembuatan QRIS
      total_dibayar: result.total_dibayar, // Total yang dibayar
      saweria_username: result.saweria_username, // Username Saweria
      saweria_apikey: result.saweria_apikey, // API key Saweria
      qr_image: result.qr_image, // URL gambar QRIS
    });
  } catch (error) {
    console.error("Error creating QRIS:", error.message);

    // Menangani error dan mengembalikan response
    res.status(500).json({
      message: "Gagal membuat QRIS.",
      error: error.message,
    });
  }
});

module.exports = router;
