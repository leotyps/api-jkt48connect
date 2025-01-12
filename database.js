const { Client } = require("pg"); // Import PostgreSQL client

// Konfigurasi koneksi ke CockroachDB
const client = new Client({
  user: "jkt48connect_apikey", // Gantilah dengan username Anda
  host: "jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud",
  database: "defaultdb",
  password: "vAgy5JNXz4woO46g8fho4g", // Gantilah dengan password Anda
  port: 26257,
  ssl: { rejectUnauthorized: false },
});

// Fungsi untuk membuka koneksi ke CockroachDB
async function connectDb() {
  try {
    await client.connect();
    console.log("Koneksi ke CockroachDB berhasil");
  } catch (error) {
    console.error("Gagal terkoneksi ke CockroachDB:", error);
  }
}

// Fungsi untuk menutup koneksi ke CockroachDB
async function disconnectDb() {
  try {
    await client.end();
    console.log("Koneksi ke CockroachDB ditutup");
  } catch (error) {
    console.error("Gagal menutup koneksi ke CockroachDB:", error);
  }
}

// Fungsi untuk menjalankan query terhadap CockroachDB
async function query(text, params) {
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error("Error menjalankan query:", error);
    throw error;
  }
}

// Export client, connectDb, disconnectDb, dan query agar bisa digunakan di file lain
module.exports = {
  client,
  connectDb,
  disconnectDb,
  query,
};
