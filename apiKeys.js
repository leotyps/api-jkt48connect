const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  ADELINE: {
    expiryDate: parseCustomDate("31/12/2029/23:59"),
    remainingRequests: 100, // Jumlah request tersisa untuk hari ini
    maxRequests: 100, // Limit maksimum per hari
    lastAccessDate: "2024-11-20", // Tanggal terakhir akses (format: YYYY-MM-DD)
  },
  "67890-FGHIJ": {
    expiryDate: parseCustomDate("30/11/2024/12:00"),
    remainingRequests: 10,
    maxRequests: 10,
    lastAccessDate: "2024-11-20",
  },
  "ForxFyyre": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
};

module.exports = apiKeys;
