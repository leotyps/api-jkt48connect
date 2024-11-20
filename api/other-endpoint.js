const express = require("express");

const router = express.Router();

// Endpoint untuk welcome message
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Selamat datang di API JKT48Connect! Ini adalah endpoint untuk website live.valzyofc.my.id.",
    owner: "Valzy",
    developer: "Valzyy",
    social_media: {
      instagram: "@valzy._",
      tiktok: "@valzyycans",
      youtube: "@valzyofc"
    },
  });
});

module.exports = router;
