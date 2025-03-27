function parseCustomDate(dateString) {
  if (dateString === "unli" || dateString === "-") {
    return dateString;
  }

  if (typeof dateString !== "string") {
    throw new Error("Format tanggal tidak valid: Harus berupa string.");
  }

  const parts = dateString.split("/");
  if (parts.length !== 4) {
    throw new Error("Format tanggal salah. Harus 'DD/MM/YYYY/HH:mm'.");
  }

  const [day, month, year, time] = parts;
  const [hour, minute] = time.split(":").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
    throw new Error("Tanggal mengandung karakter tidak valid.");
  }

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  date.setHours(date.getHours() + 7);

  return date;
}

module.exports = parseCustomDate;
