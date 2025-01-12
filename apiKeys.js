const { Client } = require('pg'); // Import pg (PostgreSQL client)
const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  JKTCONNECT: {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "J48-9F2A7B1D": {
    expiryDate: "unli",
    remainingRequests: 50,
    maxRequests: 50,
    lastAccessDate: "2024-11-20",
  },
  "fikzz123": {
    expiryDate: "unli",
    remainingRequests: 150,
    maxRequests: 150,
    lastAccessDate: "2024-11-20",
  },
  "SazxOfficial111": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "MarshaLenathea1234567890": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: 250, // Tidak terbatas
    maxRequests: 250, // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "JKT-4F5C3D8A": {
    expiryDate: "unli",
    remainingRequests: 50,
    maxRequests: 50,
    lastAccessDate: "2024-11-20",
  },
  "J48-Mamiya": {
    expiryDate: "unli",
    remainingRequests: 50,
    maxRequests: 50,
    lastAccessDate: "2024-11-20",
  },
  "J48-2E9D4B7C": {
    expiryDate: "unli",
    remainingRequests: 50,
    maxRequests: 10,
    lastAccessDate: "2024-11-20",
  },
  "vyJsnz2$d3v": {
    expiryDate: "unli",
    remainingRequests: 150,
    maxRequests: 150,
    lastAccessDate: "2024-11-20",
  },
  "ForxFyyre": {
    expiryDate: parseCustomDate("21/11/2024/18:15"),
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "SAZX": {
    expiryDate: parseCustomDate("31/12/2024/18:15"),
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
};

// Fungsi untuk menyimpan API key baru ke database CockroachDB
async function saveApiKeyToDatabase(apiKey, data) {
  const client = new Client({
    connectionString: 'postgresql://jkt48connect_apikey:vAgy5JNXz4woO46g8fho4g@jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  });

  try {
    await client.connect(); // Koneksi ke database

    // Query untuk menambahkan API key baru ke tabel
    const query = `
      INSERT INTO api_keys (api_key, expiry_date, remaining_requests, max_requests, last_access_date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (api_key) DO NOTHING
    `;

    // Menyiapkan data untuk disimpan
    const values = [
      apiKey,
      data.expiryDate,
      data.remainingRequests,
      data.maxRequests,
      data.lastAccessDate,
    ];

    // Menjalankan query
    await client.query(query, values);
    console.log(`API key ${apiKey} berhasil disimpan ke database.`);
  } catch (error) {
    console.error('Gagal menyimpan API key ke database:', error);
  } finally {
    await client.end(); // Menutup koneksi ke database
  }
}

// Menyimpan semua API keys yang sudah ada ke dalam database
async function saveAllApiKeys() {
  for (const apiKey in apiKeys) {
    await saveApiKeyToDatabase(apiKey, apiKeys[apiKey]);
  }
}

// Memanggil fungsi untuk menyimpan API keys
saveAllApiKeys();

module.exports = apiKeys;
