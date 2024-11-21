const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  ADELINE: {
    expiryDate: parseCustomDate("31/12/2029/23:59"), // Tanggal kedaluwarsa API key
    remainingRequests: 100, // Jumlah request tersisa untuk hari ini
    maxRequests: 100, // Limit maksimum per hari
    lastAccessDate: "2024-11-20", // Tanggal terakhir akses (format: YYYY-MM-DD)
  },
  "67890-FGHIJ": {
    expiryDate: parseCustomDate("30/11/2024/12:00"), // Tanggal kedaluwarsa API key
    remainingRequests: 10, // Jumlah request tersisa untuk hari ini
    maxRequests: 10, // Limit maksimum per hari
    lastAccessDate: "2024-11-20", // Tanggal terakhir akses (format: YYYY-MM-DD)
  },
  "ForxFyyre": {
    expiryDate: parseCustomDate("-"), // Tidak ada tanggal kedaluwarsa, tak terbatas
    remainingRequests: "-", // Tak terbatas
    maxRequests: "-", // Tak terbatas
    lastAccessDate: "2024-11-20", // Tanggal terakhir akses (format: YYYY-MM-DD)
  },
  "InfinityKey": {
    expiryDate: parseCustomDate("-"), // Tidak ada tanggal kedaluwarsa
    remainingRequests: "-", // Tak terbatas
    maxRequests: "-", // Tak terbatas
    lastAccessDate: "2024-11-20", // Tanggal terakhir akses (format: YYYY-MM-DD)
  },
};

module.exports = apiKeys;
