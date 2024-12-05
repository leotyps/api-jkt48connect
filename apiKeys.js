const mongoose = require("mongoose");
const parseCustomDate = require("./helpers/dateParser");
const ApiKey = require("./models/apiKey"); // Model untuk API Key

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

// Fungsi untuk menyinkronkan apiKeys ke MongoDB
const syncApiKeysWithDatabase = async () => {
  try {
    // Koneksi ke MongoDB
    await mongoose.connect("mongodb+srv://contact:pk9Gxy0yn6azNZJb@jkt48connect.whnvm.mongodb.net/?retryWrites=true&w=majority&appName=jkt48connect", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Koneksi ke MongoDB berhasil");

    // Simpan atau perbarui API keys ke MongoDB
    for (const [key, value] of Object.entries(apiKeys)) {
      const expiryDate = value.expiryDate === "unli" ? "unli" : new Date(value.expiryDate);
      const lastAccessDate = new Date(value.lastAccessDate);

      // Pastikan expiryDate adalah objek Date jika bukan "unli"
      await ApiKey.updateOne(
        { key },
        { key, expiryDate, remainingRequests: value.remainingRequests, maxRequests: value.maxRequests, lastAccessDate },
        { upsert: true }  // Jika tidak ada, buat data baru
      );

      console.log(`API key ${key} berhasil disimpan atau diperbarui di MongoDB`);
    }

    // Menutup koneksi
    await mongoose.connection.close();
    console.log("Data API key telah berhasil disinkronkan ke MongoDB");

  } catch (error) {
    console.error("Terjadi kesalahan saat menghubungkan atau menyimpan ke MongoDB:", error.message);
  }
};

// Memanggil fungsi syncApiKeysWithDatabase untuk menyimpan data ke MongoDB saat aplikasi dimulai
syncApiKeysWithDatabase();

// Mengekspor apiKeys setelah sinkronisasi
module.exports = apiKeys;
