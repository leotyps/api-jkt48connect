const syncApiKeysWithDatabase = require("../syncApiKeys");

async function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key tidak ditemukan. Harap sertakan API key di header atau query parameter.",
    });
  }

  try {
    // Sinkronisasi API key dari MongoDB
    const apiKeys = await syncApiKeysWithDatabase();
    const keyData = apiKeys[apiKey];

    if (!keyData) {
      return res.status(403).json({
        success: false,
        message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
      });
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    // Periksa apakah expiryDate = "unli", yang berarti tidak terbatas
    if (keyData.expiryDate !== "unli" && keyData.expiryDate !== "-" && now > new Date(keyData.expiryDate)) {
      return res.status(403).json({
        success: false,
        message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
      });
    }

    // Reset limit request jika hari terakhir berbeda dari hari ini
    if (keyData.lastAccessDate !== today) {
      keyData.remainingRequests = keyData.maxRequests === "-" ? "∞" : keyData.maxRequests; // Reset ke limit maksimum jika tidak terbatas
      keyData.lastAccessDate = today; // Update tanggal terakhir akses
    }

    // Periksa limit request (∞ jika tak terbatas)
    if (keyData.remainingRequests === "∞") {
      // Jika limit tidak terbatas, lanjutkan tanpa pengurangan request
      return next();
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
  } catch (error) {
    console.error("Error saat memvalidasi API key:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memvalidasi API key.",
    });
  }
}

module.exports = validateApiKey;
