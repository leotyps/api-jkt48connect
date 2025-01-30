const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Menggunakan UUID untuk memastikan nama file unik

// Fungsi untuk mengunggah buffer ke https://8030.us.kg/
async function uploadBufferTo8030(buffer, filename) {
  try {
    const form = new FormData();
    form.append("file", buffer, {
      filename,
      contentType: "image/jpeg",
    });

    const response = await axios({
      url: "https://8030.us.kg/upload",
      method: "POST",
      headers: {
        ...form.getHeaders(),
      },
      data: form,
    });

    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (err) {
    throw new Error(`Failed to upload to 8030.us.kg: ${err.message}`);
  }
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    // Menggunakan UUID untuk memastikan nama file unik
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const filename = `${uuidv4()}.jpg`; // Menggunakan UUID untuk nama file yang unik
    const url = await uploadBufferTo8030(buffer, filename);
    return { url };
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
