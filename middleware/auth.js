const { Client } = require("pg"); // PostgreSQL client

// Koneksi ke database
const dbClient = new Client({
  connectionString: 'postgresql://jkt48connect_apikey:vAgy5JNXz4woO46g8fho4g@jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
});

// Fungsi untuk memeriksa API key di database
async function getApiKeyData(apiKey) {
  try {
    const query = `SELECT * FROM api_keys WHERE api_key = $1`;
    const result = await dbClient.query(query, [apiKey]);
    return result.rows[0]; // Mengembalikan data API key (jika ada)
  } catch (error) {
    console.error("Error fetching API key from database:", error);
    return null;
  }
}

// Middleware untuk validasi API key
async function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key tidak ditemukan. Harap sertakan API key di header atau query parameter.",
    });
  }

  const keyData = await getApiKeyData(apiKey);

  if (!keyData) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

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
    keyData.remaining_requests = keyData.max_requests === "-" ? "∞" : keyData.max_requests; // Reset ke limit maksimum jika tidak terbatas
    keyData.last_access_date = today; // Update tanggal terakhir akses

    // Update di database
    try {
      const updateQuery = `
        UPDATE api_keys
        SET remaining_requests = $1, last_access_date = $2
        WHERE api_key = $3
      `;
      await dbClient.query(updateQuery, [keyData.remaining_requests, today, apiKey]);
    } catch (err) {
      console.error("Error updating API key data in database:", err);
    }
  }

  // Periksa limit request (∞ jika tak terbatas)
  if (keyData.remaining_requests === "∞") {
    // Jika limit tidak terbatas, lanjutkan tanpa pengurangan request
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
  keyData.remaining_requests -= 1;

  // Update sisa request di database
  try {
    const updateQuery = `
      UPDATE api_keys
      SET remaining_requests = $1
      WHERE api_key = $2
    `;
    await dbClient.query(updateQuery, [keyData.remaining_requests, apiKey]);
  } catch (err) {
    console.error("Error updating remaining requests in database:", err);
  }

  next();
}

// Inisialisasi koneksi ke database
(async () => {
  try {
    await dbClient.connect();
    console.log("Connected to CockroachDB for API key validation.");
  } catch (err) {
    console.error("Failed to connect to CockroachDB:", err);
  }
})();

module.exports = validateApiKey;
