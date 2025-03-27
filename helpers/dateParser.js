function parseCustomDate(dateString) {
  // Jika tanggal adalah 'unli' atau '-'
  if (dateString === "unli" || dateString === "-") {
    return dateString; // Kembalikan string "unli" atau "-" untuk menandakan tidak terbatas
  }

  // Jika formatnya adalah tanggal dan waktu
  const [day, month, year, time] = dateString.split("/");
  const [hour, minute] = time.split(":");

  // Buat objek Date dalam UTC terlebih dahulu
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Konversi ke WIB (GMT+7)
  date.setHours(date.getHours() + 7);

  return date;
}

module.exports = parseCustomDate;
