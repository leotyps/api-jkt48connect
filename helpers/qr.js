const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Menggunakan UUID untuk memastikan nama file unik

// API Key imgBB yang didapat setelah registrasi
const imgbbApiKey = "daf2a6199bf1bba1b41bd56127359bba"; // Ganti dengan API key Anda

// Fungsi untuk mengunggah buffer ke imgBB
async function uploadBufferToImgBB(buffer, filename) {
  try {
    const form = new FormData();
    
    // Mengkonversi buffer menjadi stream agar bisa diupload dengan FormData
    const stream = require("stream");
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    form.append("image", bufferStream, { filename });

    const response = await axios({
      url: `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      method: "POST",
      headers: form.getHeaders(),
      data: form,
    });

    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url; // URL gambar setelah diupload
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (err) {
    throw new Error(`Failed to upload to imgBB: ${err.message}`);
  }
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    // Menggunakan UUID untuk memastikan nama file unik
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const filename = `${uuidv4()}.jpg`; // Menggunakan UUID untuk nama file yang unik
    const url = await uploadBufferToImgBB(buffer, filename);
    return { url }; // Mengembalikan URL gambar
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
