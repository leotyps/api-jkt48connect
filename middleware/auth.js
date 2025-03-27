const apiKeys = require("../apiKeys");

function parseCustomDate(dateString) {
  if (typeof dateString !== "string") {
    throw new Error("Format expiryDate tidak valid.");
  }

  // Format: "DD/MM/YYYY/HH:mm"
  const parts = dateString.split("/");
  if (parts.length !== 4) {
    throw new Error("Format tanggal tidak sesuai. Harus 'DD/MM/YYYY/HH:mm'.");
  }

  const [day, month, year, time] = parts;
  const [hours, minutes] = time.split(":").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
    throw new Error("Tanggal mengandung karakter tidak valid.");
  }

  // Buat objek Date dalam zona waktu UTC
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Konversi ke WIB (GMT+7)
  date.setHours(date.getHours() + 7);

  return date;
}

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

  const now = new Date();
  now.setHours(now.getHours() + 7); // Ubah waktu ke WIB

  // Periksa apakah API key sudah kedaluwarsa (kecuali jika "unli" atau "-")
  if (keyData.expiryDate !== "unli" && keyData.expiryDate !== "-") {
    try {
      const expiryDate = parseCustomDate(keyData.expiryDate);

      if (now > expiryDate) {
        return res.status(403).json({
          success: false,
          message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Terjadi kesalahan dalam parsing tanggal: ${error.message}`,
      });
    }
  }

  // Periksa limit request (∞ jika tak terbatas)
  if (keyData.remainingRequests === "∞") {
    return next(); // Lanjutkan jika limit tidak terbatas
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
