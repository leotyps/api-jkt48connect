const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  "VALZY": parseCustomDate("31/12/2023/23:59"), // API key kedaluwarsa 31 Desember 2024 pukul 23:59
  "67890-FGHIJ": parseCustomDate("30/11/2024/12:00"), // API key kedaluwarsa 30 November 2024 pukul 12:00
};

module.exports = apiKeys;
