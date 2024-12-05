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

// Sinkronisasi localApiKeys dengan MongoDB
const syncApiKeysWithDatabase = async () => {
  await mongoose.connect("mongodb+srv://contact:pk9Gxy0yn6azNZJb@jkt48connect.whnvm.mongodb.net/?retryWrites=true&w=majority&appName=jkt48connect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Simpan local API keys ke MongoDB
  for (const [key, value] of Object.entries(localApiKeys)) {
    await ApiKey.updateOne(
      { key },
      { key, ...value },
      { upsert: true }
    );
  }

  // Ambil API keys dari MongoDB
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

// Ekspor API keys hasil sinkronisasi
let apiKeys = {};

syncApiKeysWithDatabase().then((data) => {
  apiKeys = data;
});

module.exports = new Proxy(apiKeys, {
  get: (target, prop) => target[prop], // Proxy untuk akses properti secara dinamis
});
