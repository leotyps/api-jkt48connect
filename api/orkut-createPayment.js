const express = require("express");
const validateApiKey = require("../middleware/auth");
const { createQr } = require("../helpers/qr");
const { generateSignature } = require("../helpers/signature");
const crypto = require("crypto");
const router = express.Router();

const convertCRC16 = (str) => {
  let crc = 0xffff;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  return hex;
};

const createDynamicQRIS = (qris, amount, includeFee = false, feeType = "rupiah", fee = "0") => {
  let qrisCode = qris.slice(0, -4); // Remove CRC16
  qrisCode = qrisCode.replace("010211", "010212");

  const [part1, part2] = qrisCode.split("5802ID");
  let uang = `54${amount.length.toString().padStart(2, "0")}${amount}`;

  if (includeFee) {
    const feeCode = feeType === "rupiah" ? "55020256" : "55020357";
    uang += `${feeCode}${fee.length.toString().padStart(2, "0")}${fee}`;
  }

  uang += "5802ID";
  const fix = `${part1}${uang}${part2}`;
  const finalResult = `${fix}${convertCRC16(fix)}`;

  return finalResult;
};

const generateRandomKey = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

const generateMerchantOrderId = () => {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD${timestamp}${randomSuffix}`;
};

router.get("/", validateApiKey, async (req, res) => {
  const { qris, amount, includeFee, feeType, fee, merchantCode } = req.query;

  if (!qris || !amount || !merchantCode) {
    return res.status(400).json({
      message: "Parameter 'qris', 'amount', dan 'merchantCode' harus disertakan.",
    });
  }

  try {
    // Generate mKey and merchantOrderId automatically
    const mKey = generateRandomKey(16);
    const merchantOrderId = generateMerchantOrderId();

    // Generate dynamic QRIS
    const dynamicQRIS = createDynamicQRIS(
      qris,
      amount,
      includeFee === "true",
      feeType || "rupiah",
      fee || "0"
    );

    // Generate signature
    const signature = generateSignature(merchantCode, merchantOrderId, amount, mKey);

    // Create QR Code
    const qrResult = await createQr(dynamicQRIS);

    res.json({
      author: "Valzyy",
      originalQRIS: qris,
      dynamicQRIS,
      amount,
      includeFee: includeFee === "true",
      feeType,
      fee,
      qrImageUrl: qrResult.url,
      merchantOrderId,
      mKey,
      signature,
    });
  } catch (error) {
    console.error("Error creating dynamic QRIS:", error.message);
    res.status(500).json({
      message: "Gagal membuat QRIS dinamis.",
      error: error.message,
    });
  }
});

module.exports = router;
