const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  JKTCONNECT: {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: 1908239, // Tidak terbatas
    maxRequests: 3898729, // Tidak terbatas
    lastAccessDate: "2024-11-20",
    seller: true,
    premium: true,
  },
  "zlfdinhere88246h": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "TanzManuel": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "aldo": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "irfan567": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "sazxbot352c": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "sazxapi123h": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "depo": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "J48-Kyyj": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "azeexcuy": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "J48-Mamia": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "JC-SYF2AAJ": {
    expiryDate: "unli",
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "J48-Fans": {
    expiryDate: "unli",
    remainingRequests: "∞",
    maxRequests: "∞",
    lastAccessDate: "2024-11-20",
  },
  "J48-Kent": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "J48-Rafaa": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "J48-Relll": {
    expiryDate: parseCustomDate("21/11/2024/18:15"),
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "JC-U4P0FC": {
    expiryDate: parseCustomDate("30/4/2025/12:39"),
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "JC-R5TKDI": {
    expiryDate: parseCustomDate("30/4/2025/12:39"),
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "Rdzhooo75": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "Rizz Bwot": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2024-11-20",
  },
  "J48-ijull56": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: 250, // Tidak terbatas
    maxRequests: 250, // Tidak terbatas
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "fikzz11112": {
    expiryDate: "unli",
    remainingRequests: 150,
    maxRequests: 150,
    lastAccessDate: "2024-11-20",
  },
  "marshalena": {
    expiryDate: "unli", // Tidak terbatas
    remainingRequests: 250, // Tidak terbatas
    maxRequests: 250, // Tidak terbatas
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "JKT-4F5C3D8A": {
    expiryDate: parseCustomDate("07/04/2025/00:56"),
    remainingRequests: 50,
    maxRequests: 50,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "DP-YEON32": {
    expiryDate: "unli",
    remainingRequests: 500,
    maxRequests: 500,
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
  "XIOVE": {
    expiryDate: "unli",
    remainingRequests: 150,
    maxRequests: 150,
    lastAccessDate: "2024-11-20",
    premium: true,
  },
  "ForxFyyre": {
    expiryDate: parseCustomDate("27/03/2025/16:51"),
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞", // Tidak terbatas
    lastAccessDate: "2024-11-20",
  },
  "SAZX": {
    expiryDate: parseCustomDate("31/12/2024/18:15"),
    remainingRequests: "∞", // Tidak terbatas
    maxRequests: "∞",
    lastAccessDate: "2024-11-20",
  },
  "valzysigma": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2025-03-30",
    premium: true
  },
        "zurabotsigma": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2025-03-30",
    premium: true,
    seller: true
  },
    "sss": {
    expiryDate: "unli",
    remainingRequests: 250,
    maxRequests: 250,
    lastAccessDate: "2025-03-30",
    premium: true,
    seller: true
  },
};
module.exports = apiKeys;
