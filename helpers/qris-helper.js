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

module.exports = { createDynamicQRIS };
