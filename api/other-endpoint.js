const express = require("express");
const path = require("path");

const router = express.Router();

// Endpoint untuk menampilkan file index.html dari root folder
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

module.exports = router;
