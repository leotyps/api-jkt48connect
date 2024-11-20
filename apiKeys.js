const parseCustomDate = require("./helpers/dateParser");

// Database API key
let apiKeys = {
  "EXISTING_KEY": parseCustomDate("31/12/2029/23:59"),
};

// Fungsi untuk menambahkan API key baru
function addApiKey(apiKey, expiryDate) {
  apiKeys[apiKey] = parseCustomDate(expiryDate);
}

// Fungsi untuk menyimpan ke dalam database atau file
function saveApiKeysToFile() {
  const fs = require("fs");
  const data = JSON.stringify(apiKeys, null, 2); // Format JSON rapi
  fs.writeFileSync("./apiKeys.json", data);
}

// Contoh penggunaan
const newKey = generateApiKey();
addApiKey(newKey, "31/12/2024/23:59");
saveApiKeysToFile();

module.exports = { apiKeys, addApiKey };
