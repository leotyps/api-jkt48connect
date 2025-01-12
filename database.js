const { Pool } = require("pg"); // Menggunakan Pooling untuk koneksi database

// Konfigurasi koneksi ke CockroachDB dengan Pooling
const pool = new Pool({
  user: "jkt48connect_apikey", // Gantilah dengan username Anda
  host: "jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud",
  database: "defaultdb",
  password: "vAgy5JNXz4woO46g8fho4g", // Gantilah dengan password Anda
  port: 26257,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // Timeout koneksi 5 detik
  statement_timeout: 10000, // Timeout query 5 detik
});

// Fungsi untuk membuka koneksi ke CockroachDB (pooling akan menangani koneksi)
async function connectDb() {
  try {
    await pool.connect();
    console.log("Koneksi ke CockroachDB berhasil");
  } catch (error) {
    console.error("Gagal terkoneksi ke CockroachDB:", error);
  }
}

// Fungsi untuk menutup koneksi ke CockroachDB
async function disconnectDb() {
  try {
    await pool.end(); // Menghentikan semua koneksi dalam pool
    console.log("Koneksi ke CockroachDB ditutup");
  } catch (error) {
    console.error("Gagal menutup koneksi ke CockroachDB:", error);
  }
}

// Fungsi untuk menjalankan query terhadap CockroachDB dengan timeout
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error("Error menjalankan query:", error);
    throw error;
  }
}

// Export pool, connectDb, disconnectDb, dan query agar bisa digunakan di file lain
module.exports = {
  pool,
  connectDb,
  disconnectDb,
  query,
};
