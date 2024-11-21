function parseCustomDate(dateString) {
  // Jika input adalah "-" (tak terbatas), kembalikan null (menandakan tidak ada tanggal kedaluwarsa)
  if (dateString === "-") {
    return null;
  }

  // Contoh format input: "20/11/2024/14:30"
  const [day, month, year, time] = dateString.split("/");
  const [hour, minute] = time.split(":");

  // Buat objek Date berdasarkan komponen-komponen tersebut
  return new Date(year, month - 1, day, hour, minute);
}

module.exports = parseCustomDate;
