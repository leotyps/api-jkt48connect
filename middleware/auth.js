const dbClient = require("../database"); // Mengimpor fungsi query dari database.js

// Fungsi untuk menangani timeout
const withTimeout = (promise, timeout) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout)
  );
  return Promise.race([promise, timeoutPromise]);
};

async function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key tidak ditemukan. Harap sertakan API key di header atau query parameter.",
    });
  }

  try {
    // Tentukan timeout untuk query database, misalnya 5 detik
    const timeout = 5000; // Timeout 5 detik

    // Ambil data API key dari database dengan timeout
    const result = await withTimeout(
      dbClient.query("SELECT * FROM api_keys WHERE api_key = $1", [apiKey]),
      timeout
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
      });
    }

    const keyData = result.rows[0];
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    // Periksa apakah expiryDate = "unli", yang berarti tidak terbatas
    if (keyData.expiry_date !== "unli" && keyData.expiry_date !== "-" && now > new Date(keyData.expiry_date)) {
      return res.status(403).json({
        success: false,
        message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
      });
    }

    // Reset limit request jika hari terakhir berbeda dari hari ini
    if (keyData.last_access_date !== today) {
      const newRemainingRequests = keyData.max_requests === "-" ? "∞" : keyData.max_requests;
      await withTimeout(
        dbClient.query(
          "UPDATE api_keys SET remaining_requests = $1, last_access_date = $2 WHERE api_key = $3",
          [newRemainingRequests, today, apiKey]
        ),
        timeout
      );
    }

    // Periksa limit request (∞ jika tak terbatas)
    if (keyData.remaining_requests === "∞") {
      return next();
    }

    // Validasi limit request
    if (keyData.remaining_requests <= 0) {
      return res.status(429).json({
        success: false,
        message: "Batas request API key Anda telah habis. Silakan hubungi WhatsApp 6285701479245 untuk membeli limit tambahan.",
      });
    }

    // Kurangi jumlah request yang tersisa
    await withTimeout(
      dbClient.query(
        "UPDATE api_keys SET remaining_requests = remaining_requests - 1 WHERE api_key = $1",
        [apiKey]
      ),
      timeout
    );

    next();
  } catch (error) {
    console.error("Error during API key validation:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan saat memvalidasi API key. Silakan coba lagi nanti.",
    });
  }
}

module.exports = validateApiKey;
