const mongoose = require("mongoose");
const ApiKey = require("./models/apiKey"); // Path ke model
const parseCustomDate = require("./helpers/dateParser");

const localApiKeys = {
  JKTCONNECT: {
    expiryDate: "unli", 
    remainingRequests: "∞",
    maxRequests: "∞",
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
    remainingRequests: "∞",
    maxRequests: "∞",
    lastAccessDate: "2024-11-20",
  },
};

const syncApiKeysWithDatabase = async () => {
  await mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Simpan API Key dari local ke MongoDB
  for (const [key, value] of Object.entries(localApiKeys)) {
    await ApiKey.updateOne(
      { key },
      { key, ...value },
      { upsert: true } // Tambahkan jika tidak ada
    );
  }

  // Ambil API Key dari MongoDB ke local
  const dbApiKeys = await ApiKey.find();
  const combinedApiKeys = {};

  dbApiKeys.forEach((apiKey) => {
    combinedApiKeys[apiKey.key] = {
      expiryDate: apiKey.expiryDate,
      remainingRequests: apiKey.remainingRequests,
      maxRequests: apiKey.maxRequests,
      lastAccessDate: apiKey.lastAccessDate,
    };
  });

  mongoose.connection.close();

  return combinedApiKeys;
};

module.exports = syncApiKeysWithDatabase;
