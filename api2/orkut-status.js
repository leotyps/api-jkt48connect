const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: "*", 
}));

// Endpoint untuk mengecek status pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { merchant, keyorkut, amount } = req.query; // Menangkap parameter dari query URL

  // Validasi parameter wajib
  if (!merchant || !keyorkut) {
    return res.status(400).json({
      message: "Parameter 'merchant' dan 'keyorkut' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API cek status pembayaran
    const response = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`);
    let statusData = response.data;

    // Jika parameter `amount` diberikan, filter data yang sesuai
    if (amount) {
      const amountNumber = Number(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        return res.status(400).json({
          message: "Parameter 'amount' harus berupa angka yang valid.",
        });
      }

      statusData = statusData.filter(transaction => Number(transaction.amount) === amountNumber);
    }

    // Mengembalikan data yang sudah difilter
    res.json(statusData);
  } catch (error) {
    console.error("Error checking payment status:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal mengecek status pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
