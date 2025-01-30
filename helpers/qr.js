const qrcode = require("qrcode");
const { fromBuffer } = require("file-type");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Menggunakan UUID untuk memastikan nama file unik

// Fungsi untuk mengunggah buffer ke Meitang CDN
async function uploadBufferToMeitang(buffer) {
  try {
    const { ext } = await fromBuffer(buffer); // Mendapatkan ekstensi dari buffer
    let form = new FormData();
    form.append("file", buffer, "tmp." + ext); // Menambahkan buffer dan ekstensi file

    const response = await fetch("https://cdn.meitang.xyz/upload", {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload file");
    }

    return data.file.url; // Mengembalikan URL file yang diupload
  } catch (err) {
    throw new Error(`Failed to upload to Meitang CDN: ${err.message}`);
  }
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    // Menggunakan UUID untuk memastikan nama file unik
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const url = await uploadBufferToMeitang(buffer); // Mengupload buffer ke Meitang CDN
    return { url };
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
