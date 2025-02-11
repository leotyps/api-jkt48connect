const apiKeys = require("../apiKeys");

const requestTracker = {}; // Menyimpan jumlah request yang dilakukan setiap API key dalam 24 jam

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
  const timeWindow = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
  const maxRequests = keyData.remainingRequests; // Limit request berdasarkan API key

  // Periksa apakah API key sudah kedaluwarsa (kecuali jika "unli")
  if (keyData.expiryDate !== "unli" && keyData.expiryDate !== "-" && now > new Date(keyData.expiryDate)) {
    return res.status(403).json({
      success: false,
      message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  // Periksa limit request (jika tidak terbatas, lanjutkan)
  if (keyData.remainingRequests === "∞") {
    return next();
  }

  // Inisialisasi tracking jika belum ada
  if (!requestTracker[apiKey]) {
    requestTracker[apiKey] = {
      count: 0,
      startTime: now,
    };
  }

  const tracker = requestTracker[apiKey];

  // Reset hitungan jika sudah lebih dari 24 jam
  if (now - tracker.startTime > timeWindow) {
    tracker.count = 0;
    tracker.startTime = now;
  }

  // Cek apakah batas request sudah tercapai
  if (tracker.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: `Batas request API key Anda (${maxRequests} request per 24 jam) telah habis. Silakan hubungi WhatsApp 6285701479245 untuk membeli limit tambahan.`,
    });
  }

  // Tambah hitungan request
  tracker.count += 1;

  next();
}

module.exports = validateApiKey;
