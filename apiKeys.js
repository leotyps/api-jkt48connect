const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  JKTCONNECT: {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
    seller: true,
    premium: true,
  },
  "zlfdinhere88246": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "J48-Mami": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "J48-Rell": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "Rdzhooo": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "fikzz111": {
    expiryDate: "unli",
    remainingRequests: 150,
    maxRequests: 150,
    lastAccessDate: "2024-11-20",
  },
  "MarshaLenathea1234567890": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: 250, // Tidak terbatas
    maxRequests: 250, // Tidak terbatas
    lastAccessDate: "2024-11-20",
    premium: true,
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
    seller: true,
    premium: true,
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
    premium: true,
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
module.exports = apiKeys;
