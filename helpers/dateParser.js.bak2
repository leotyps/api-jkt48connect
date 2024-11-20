const parseCustomDate = (dateString) => {
  // Parsing tanggal dengan format dd/mm/yyyy/hh:mm
  const [datePart, timePart] = dateString.split('/');
  const [day, month, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');

  // Membuat objek Date
  const date = new Date(year, month - 1, day, hour, minute);

  // Menggunakan Intl.DateTimeFormat untuk format tanggal
  const options = {
    weekday: 'long', // Menampilkan nama hari
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12-hour format (AM/PM)
  };

  const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);

  return formattedDate; // Format seperti "Sabtu, 12 Agustus 2024 jam 12:00"
};

module.exports = parseCustomDate;
