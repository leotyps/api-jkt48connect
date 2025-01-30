const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Menggunakan UUID untuk memastikan nama file unik

// Fungsi untuk mengunggah buffer ke tmpfiles.org
async function tmpFiles(buffer) {
  return new Promise(async (resolve, reject) => {
    // Menentukan ekstensi dan tipe MIME secara manual berdasarkan format buffer (JPEG)
    const ext = 'jpg';
    const mime = 'image/jpeg';

    const form = new FormData();
    form.append('file', buffer, {
      filename: new Date() * 1 + '.' + ext,
      contentType: mime
    });

    try {
      const { data } = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      resolve(data);
    } catch (e) {
      reject(e?.response || e);
    }
  });
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    // Menggunakan UUID untuk memastikan nama file unik
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const data = await tmpFiles(buffer); // Menggunakan tmpFiles untuk upload buffer
    return { url: data.url }; // Menyimpan URL dari tmpfiles
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
