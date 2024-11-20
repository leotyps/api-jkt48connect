const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  "ADELINE": parseCustomDate("31/12/2029/23:59"), // API key kedaluwarsa 31 Desember 2024 pukul 23:59
  "67890-FGHIJ": parseCustomDate("30/11/2023/12:00"),
  "ForxFyyre": parseCustomDate("21/11/2024/18:15"),
 };

module.exports = apiKeys;
