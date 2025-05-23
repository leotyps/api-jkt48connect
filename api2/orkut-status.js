const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: "*", 
}));

// Endpoint untuk mengecek status pembayaran dengan filter amount
router.get("/", validateApiKey, async (req, res) => {
  const { merchant, keyorkut, amount } = req.query; // Ambil parameter dari query

  // Validasi input query
  if (!merchant || !keyorkut) {
    return res.status(400).json({
      message: "Parameter 'merchant' dan 'keyorkut' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API OkeConnect
    const response = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`);
    const statusData = response.data;

    // Jika ada parameter 'amount', filter data berdasarkan jumlah tersebut
    if (amount && !isNaN(amount)) {
      const filteredData = statusData.data.filter(item => item.amount === amount);
      return res.json({
        status: "success",
        data: filteredData
      });
    }

    // Jika tidak ada filter 'amount', kirim semua data
    res.json(statusData);
  } catch (error) {
    console.error("Error checking payment status:", error.message);

    res.status(500).json({
      message: "Gagal mengecek status pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
