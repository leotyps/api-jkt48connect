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
  "JKT-4F5C3D8A": {
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
  "67890-FGHIJ": {
    expiryDate: parseCustomDate("30/11/2024/12:00"),
    remainingRequests: 10,
    maxRequests: 10,
    lastAccessDate: "2024-11-20",
  },
  "ForxFyyre": {
    expiryDate: parseCustomDate("21/11/2024/18:15"),
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
};

module.exports = apiKeys;
