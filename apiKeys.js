const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  "ADELINE": {
    expiryDate: parseCustomDate("31/12/2029/23:59"),
    remainingRequests: 100, // Limit jumlah request
    maxRequests: 100,
  },
  "67890-FGHIJ": {
    expiryDate: parseCustomDate("30/11/2024/12:00"),
    remainingRequests: 50, // Limit jumlah request
    maxRequests: 50,
  },
  "Valzyy": {
    expiryDate: parseCustomDate("30/11/2024/12:00"),
    remainingRequests: 1, // Limit jumlah request
    maxRequests: 1,
  },
};

module.exports = apiKeys;
