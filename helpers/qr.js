const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");

async function uploadBufferToCatbox(buffer) {
  try {
    let formData = new FormData();
    
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", buffer, "tmp.png"); // Default ke PNG

    const { data } = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return data.startsWith("https") ? data : `https://files.catbox.moe/${data}`;
  } catch (err) {
    console.error("Catbox Error:", err.message);
    return null;
  }
}

const createQr = async (text) => {
  try {
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const url = await uploadBufferToCatbox(buffer);
    return { url };
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
