
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth");

const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: "*", 
}));

// Endpoint untuk mengecek status pembayaran dengan filter amount
router.get("/", validateApiKey, async (req, res) => {
  const { merchant, keyorkut, amount } = req.query;

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

    // Log response untuk debugging
    console.log("API Response:", statusData);

    // Validasi struktur response
    if (!statusData || !Array.isArray(statusData.data)) {
      return res.status(500).json({
        message: "Format response dari API tidak valid.",
        receivedData: statusData
      });
    }

    // Jika ada parameter 'amount', filter data berdasarkan jumlah tersebut
    if (amount && !isNaN(amount)) {
      const amountNumber = parseFloat(amount);
      const filteredData = statusData.data.filter(item => 
        item && typeof item.amount !== 'undefined' && parseFloat(item.amount) === amountNumber
      );
      
      return res.json({
        status: "success",
        data: filteredData,
        total: filteredData.length
      });
    }

    // Jika tidak ada filter 'amount', kirim semua data
    res.json(statusData);
  } catch (error) {
    console.error("Error checking payment status:", error);

    // Handle different types of errors
    if (error.response) {
      // API responded with error status
      return res.status(error.response.status).json({
        message: "API OkeConnect mengembalikan error.",
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      // Network error
      return res.status(503).json({
        message: "Tidak dapat terhubung ke API OkeConnect.",
        error: "Network error"
      });
    } else {
      // Other errors
      return res.status(500).json({
        message: "Gagal mengecek status pembayaran.",
        error: error.message,
      });
    }
  }
});

module.exports = router;
