const express = require("express");

const router = express.Router();

// Endpoint untuk welcome message
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Selamat datang di API JKT48Connect! Ini adalah source api untuk website www.jkt48connect.my.id",
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
