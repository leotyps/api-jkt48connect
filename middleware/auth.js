const apiKeys = require("../apiKeys");

function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key; // Periksa header atau query

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key tidak ditemukan. Harap sertakan API key di header atau query parameter.",
    });
  }

  const expiryDate = apiKeys[apiKey];

  if (!expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid.",
    });
  }

  const now = new Date();

  if (now > expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key sudah kedaluwarsa.",
    });
  }

  // Jika valid, lanjutkan ke handler berikutnya
  next();
}

module.exports = validateApiKey;
