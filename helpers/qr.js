const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Untuk nama file unik

// Fungsi untuk mengunggah buffer ke GoFile.io
async function uploadBufferToGoFile(buffer, filename) {
  try {
    const form = new FormData();
    form.append("file", buffer, { filename });

    const response = await axios.post("https://store1.gofile.io/uploadFile", form, {
      headers: { ...form.getHeaders() },
    });

    if (response.data.status === "ok") {
      return response.data.data.downloadPage;
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (err) {
    throw new Error(`Failed to upload to GoFile: ${err.message}`);
  }
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const filename = `${uuidv4()}.jpg`; // Nama file unik
    const url = await uploadBufferToGoFile(buffer, filename);
    return { url };
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
