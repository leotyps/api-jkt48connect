const parseCustomDate = require("./helpers/dateParser");

// Objek untuk menyimpan API key dan masa aktifnya
const apiKeys = {
  ADELINE: parseCustomDate("31/12/2029/23:59"), // API key kedaluwarsa 31 Desember 2029 pukul 23:59
  "67890-FGHIJ": parseCustomDate("30/11/2023/12:00"),
  ForxFyyre: parseCustomDate("21/11/2024/18:15"),
};

// Fungsi untuk menambahkan API key baru secara dinamis
function addApiKey(key, expiryDate) {
  apiKeys[key] = parseCustomDate(expiryDate); // Tambahkan API key ke objek
}

module.exports = {
  apiKeys,
  addApiKey, // Ekspor fungsi untuk digunakan di file lain
};
