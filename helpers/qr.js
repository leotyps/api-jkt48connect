const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Menggunakan UUID untuk memastikan nama file unik

// Fungsi untuk mengunggah buffer ke Pomf2
async function pomf(media) {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('files[]', media, { 
      filename: new Date() * 1 + '.jpg' // Nama file menggunakan timestamp agar unik
    });

    try {
      const response = await axios.post('https://pomf2.lain.la/upload.php', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      resolve(response.data); // Mengembalikan data dari respons Pomf
    } catch (error) {
      reject(error?.response || error); // Menangani error jika terjadi
    }
  });
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    // Menggunakan UUID untuk memastikan nama file unik
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const urlData = await pomf(buffer); // Mengunggah buffer ke Pomf
    return { url: urlData?.files[0]?.url }; // Mengembalikan URL file yang diunggah
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
