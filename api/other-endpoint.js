const express = require("express");

const router = express.Router();

// Contoh endpoint lainnya
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ini adalah endpoint lainnya.",
  });
});

module.exports = router;
