const apiKeys = require("../apiKeys");

function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key tidak ditemukan. Harap sertakan API key di header atau query parameter.",
    });
  }

  const keyData = apiKeys[apiKey];

  if (!keyData) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

  // Pastikan properti lastReset ada (default ke waktu sekarang jika tidak ada)
  if (!keyData.lastReset) {
    keyData.lastReset = now;
  }

  // Periksa apakah API key sudah kedaluwarsa (kecuali jika "unli")
  if (keyData.expiryDate !== "unli" && keyData.expiryDate !== "-" && now > new Date(keyData.expiryDate)) {
    return res.status(403).json({
      success: false,
      message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  // Jika limit request tidak terbatas, lanjutkan langsung
  if (keyData.remainingRequests === "∞") {
    return next();
  }

  // Reset remainingRequests jika sudah lebih dari 24 jam sejak reset terakhir
  if (now - keyData.lastReset >= twentyFourHours) {
    keyData.remainingRequests = keyData.maxRequests; // Kembalikan ke maxRequests
    keyData.lastReset = now; // Perbarui waktu reset terakhir
  }

  // Validasi limit request
  if (keyData.remainingRequests <= 0) {
    return res.status(429).json({
      success: false,
      message: "Batas request API key Anda telah habis. Silakan hubungi WhatsApp 6285701479245 untuk membeli limit tambahan.",
    });
  }

  // Kurangi jumlah request yang tersisa
  keyData.remainingRequests -= 1;

  next();
}

module.exports = validateApiKey;
