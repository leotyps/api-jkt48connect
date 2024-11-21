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

  if (typeof keyData.remainingRequests !== "number" || typeof keyData.maxRequests !== "number") {
    return res.status(500).json({
      success: false,
      message: "Konfigurasi API key tidak valid. Hubungi admin untuk bantuan.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Sisa limit API key berhasil diambil.",
    data: {
      remainingRequests: keyData.remainingRequests,
      maxRequests: keyData.maxRequests,
      expiryDate: keyData.expiryDate.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  });
});

module.exports = router;
