const express = require("express");
const cors = require("cors");
const { createDynamicQRIS } = require("./helpers/qris-helper");
const validateApiKey = require("../middleware/auth");

const router = express.Router();

// Enable CORS
router.use(cors({ origin: "*" }));

// QRIS API Endpoint
router.get("/", validateApiKey, async (req, res) => {
  const { qris, amount, includeFee, feeType, fee } = req.query;

  if (!qris || !amount) {
    return res.status(400).json({
      message: "Parameter 'qris' dan 'amount' harus disertakan.",
    });
  }

  try {
    const dynamicQRIS = createDynamicQRIS(
      qris,
      amount,
      includeFee === "true", // Convert string to boolean
      feeType || "rupiah",
      fee || "0"
    );

    res.json({
      author: "Valzyy",
      originalQRIS: qris,
      dynamicQRIS,
      amount,
      includeFee: includeFee === "true",
      feeType,
      fee,
    });
  } catch (error) {
    console.error("Error converting QRIS:", error.message);
    res.status(500).json({
      message: "Gagal mengonversi QRIS.",
      error: error.message,
    });
  }
});

module.exports = router;
