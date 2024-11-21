const express = require("express");
const router = express.Router();
const apiKeys = require("../apiKeys");

// Endpoint untuk mengecek sisa limit API key
router.get("/check-limit/:api_key", (req, res) => {
  const { api_key } = req.params;
  const keyData = apiKeys[api_key];

  if (!keyData) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid.",
    });
  }

  const now = new Date();

  if (now > keyData.expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key sudah kedaluwarsa.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Sisa limit API key berhasil diambil.",
    data: {
      remainingRequests: keyData.remainingRequests,
      maxRequests: keyData.maxRequests,
      expiryDate: keyData.expiryDate,
    },
  });
});

module.exports = router;
