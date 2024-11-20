const apiKeys = require("../apiKeys");

function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key; // Periksa header atau query

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message:
        "API key tidak ditemukan. Harap sertakan API key di header atau query parameter. Jika Anda belum memiliki API key, silakan hubungi nomor 6285701479245 untuk membelinya.",
    });
  }

  const expiryDate = apiKeys[apiKey];

  if (!expiryDate) {
    return res.status(403).json({
      success: false,
      message:
        "API key tidak valid. Harap pastikan Anda memiliki API key yang valid. Jika belum, silakan hubungi nomor 6285701479245 untuk membeli API key.",
    });
  }

  const now = new Date();

  if (now > expiryDate) {
    return res.status(403).json({
      success: false,
      message:
        "API key sudah kedaluwarsa. Silakan perpanjang masa berlaku API key Anda dengan menghubungi nomor 6285701479245.",
    });
  }

  // Jika valid, lanjutkan ke handler berikutnya
  next();
}

module.exports = validateApiKey;
