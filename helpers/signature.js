const crypto = require("crypto");

/**
 * Generate signature for QRIS request
 * @param {string} merchantCode - The merchant code
 * @param {string} merchantOrderId - The merchant order ID
 * @param {string} paymentAmount - The payment amount
 * @param {string} mKey - The secret key
 * @returns {string} - The generated MD5 signature
 */
const generateSignature = (merchantCode, merchantOrderId, paymentAmount, mKey) => {
  // Concatenate values into signToString
  const signToString = `${merchantCode}${merchantOrderId}${paymentAmount}${mKey}`;

  // Generate MD5 hash of signToString
  const signature = crypto.createHash("md5").update(signToString).digest("hex");

  return signature;
};

module.exports = { generateSignature };
