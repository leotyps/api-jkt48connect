const express = require("express");
const cors = require("cors");
const { createPaymentQr } = require("saweria-createqr"); // Mengimpor fungsi createPaymentQr dari modul saweria-createqr
const validateApiKey = require("../middleware/auth");
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS menggunakan Saweria
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query;

  // Validasi parameter wajib
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Membuat QRIS menggunakan username dan amount dengan optional message
    const result = await createPaymentQr(username, {
      amount: parseInt(amount),
      message: message || "", // Jika message tidak disertakan, kosongkan
    });

    // Mengirimkan hasil QRIS dalam format JSON
    res.json({
      author: "@sumshiiy", // Nama author yang sesuai
      trx_id: result.trx_id, // ID transaksi yang dihasilkan
      message: result.message, // Pesan yang disertakan dalam QRIS
      amount: result.amount, // Jumlah pembayaran yang dihasilkan
      qr_string: result.qr_string, // String QRIS yang dihasilkan
      created_at: result.created_at, // Tanggal pembuatan QRIS
      total_dibayar: result.total_dibayar, // Total yang dibayar (jika ada)
      saweria_username: result.saweria_username, // Username Saweria
      saweria_apikey: result.saweria_apikey, // API key Saweria
      qr_image: result.qr_image, // URL gambar QRIS
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
