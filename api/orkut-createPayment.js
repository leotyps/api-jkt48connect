const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const { createPaymentQr } = require("jkt48connect-saweria"); // Import fungsi dari jkt48connect-saweria
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*',
}));

// Endpoint untuk membuat pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query; // Mendapatkan parameter amount, username, dan message dari query URL

  // Pastikan amount dan username ada dalam query
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Menggunakan module jkt48connect-saweria untuk membuat pembayaran QR
    const result = await createPaymentQr(username, { amount: parseInt(amount), message });

    // Mengembalikan data dalam format JSON langsung tanpa creator
    res.json({
      author: "Valzyy",
      trx_id: result.trx_id,
      message: result.message,
      amount: result.amount,
      qr_string: result.qr_string,
      created_at: result.created_at,
      total_dibayar: result.total_dibayar,
      saweria_username: result.saweria_username,
      saweria_apikey: result.saweria_apikey,
      qr_image: result.qr_image, // Menyertakan qr_image yang diterima
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
