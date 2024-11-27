![20241127_092338](https://github.com/user-attachments/assets/8b1bdbe9-47b0-4ffa-b6e1-cd46770bcae2)


# JKT48Connect API CLI & Modul

Sebuah CLI dan modul sederhana untuk berinteraksi dengan [API JKT48Connect](https://www.jkt48connect.my.id). Alat ini memungkinkan Anda mengambil data seperti validasi API key, data teater, detail event, membuat pembayaran, memeriksa status pembayaran, dan lainnya.

## Fitur
- **Validasi API Key**  
- Mengambil data **Theater**.  
- Mengambil data **Event** dan detail event.  
- Mengambil detail **Theater**.  
- Mengambil detail **Member**.  
- Mengambil data **Live**.  
- **Membuat Pembayaran** melalui API Orkut.  
- **Memeriksa Status Pembayaran** melalui API Orkut.
- Mendapatkan data **Semua Member** dari JKT48.
- Mendapatkan data **Live Terbaru**.

---

## API Key Gratis

Tersedia 3 API key gratis yang dapat digunakan untuk percakapan dan percakapan terbatas. Masing-masing API key memiliki batas request sebanyak **50** kali. Anda dapat langsung menggunakan salah satu dari API key berikut:

1. **API Key 1**: `J48-9F2A7B1D`
2. **API Key 2**: `JKT-4F5C3D8A`
3. **API Key 3**: `J48-2E9D4B7C`

Silakan pilih salah satu API key di atas untuk memulai penggunaan tanpa biaya. Jika Anda membutuhkan lebih banyak kuota atau durasi lebih lama, Anda dapat membeli API key dengan menghubungi nomor WhatsApp yang disediakan di bawah.

---

## Pembelian API Key
API key tambahan dapat dibeli dengan cara berikut:

1. **Melalui WhatsApp Manual**  
   Hubungi nomor berikut untuk memesan API key secara manual:  
   **+62 857-0147-9245**  

2. **Melalui Bot WhatsApp**  
   Kirim perintah berikut ke nomor bot: **+62 857-0147-9245**  
   ```plaintext
   .buyapi <CustomApiName> <RequestLimit> <DurasiAktif>
   ```
   Contoh:
   ```plaintext
   .buyapi Valzy 250 5hari
   ```
   Penjelasan:
   - `<CustomApiName>`: Nama API yang ingin Anda beli (misalnya: Valzy).
   - `<RequestLimit>`: Batas jumlah request yang dapat dilakukan dengan API key tersebut.
   - `<DurasiAktif>`: Durasi waktu aktif API key, dapat menggunakan format seperti `5hari`, `1bulan`, dll.

---

## Instalasi
### Instalasi Global (CLI)  
Untuk menggunakan alat ini melalui terminal, instal secara global:  
```bash
npm install -g jkt48connect-api
```

### Instalasi Sebagai Modul
Jika Anda ingin menggunakan fungsi API dalam proyek Node.js:  
```bash
npm install jkt48connect-api
```

---

## Penggunaan
### CLI
Jalankan alat ini dari terminal dengan perintah:  
```bash
jkt48connect <command> <api_key> [additional_params]
```

### Perintah yang Tersedia:
| Perintah            | Deskripsi                                 | Contoh Penggunaan                                       |
|---------------------|-------------------------------------------|--------------------------------------------------------|
| `check`             | Validasi API key                         | `jkt48connect check <api_key>`                         |
| `theater`           | Ambil data theater                       | `jkt48connect theater <api_key>`                       |
| `events`            | Ambil data event                         | `jkt48connect events <api_key>`                        |
| `eventDetail`       | Ambil detail untuk event tertentu         | `jkt48connect eventDetail <api_key> <event_id>`        |
| `theaterDetail`     | Ambil detail untuk theater tertentu       | `jkt48connect theaterDetail <api_key> <theater_id>`    |
| `memberDetail`      | Ambil detail untuk member tertentu        | `jkt48connect memberDetail <api_key> <member_id>`      |
| `allMembers`        | Ambil data semua member                   | `jkt48connect allMembers <api_key>`                    |
| `live`              | Ambil data live                          | `jkt48connect live <api_key>`                          |
| `recentLive`        | Ambil data live terbaru                  | `jkt48connect recentLive <api_key>`                    |
| `createPayment`     | Buat pembayaran menggunakan Orkut API     | `jkt48connect createPayment <api_key> <amount> <qr_code>` |
| `checkPaymentStatus`| Cek status pembayaran menggunakan Orkut   | `jkt48connect checkPaymentStatus <api_key> <merchant_id> <key_orkut>` |

---

### Modul
Gunakan fungsi berikut dalam proyek Node.js Anda:

#### Contoh Penggunaan:
```javascript
const {
  checkApiKey,
  getTheater,
  getEvents,
  getEventDetail,
  getTheaterDetail,
  getMemberDetail,
  getAllMembers,
  getLive,
  createPayment,
  checkPaymentStatus,
} = require("jkt48connect-api");

// Contoh: Validasi API Key
checkApiKey("ApiKey")
  .then(() => console.log("API Key valid!"))
  .catch((err) => console.error(err));

// Contoh: Membuat Pembayaran
createPayment("ApiKey", 100000, "sample-qr-code")
  .then((data) => console.log("Payment Created:", data))
  .catch((err) => console.error(err));

// Contoh: Cek Status Pembayaran
checkPaymentStatus("ApiKey", "merchant-id", "your-key-orkut")
  .then((data) => console.log("Payment Status:", data))
  .catch((err) => console.error(err));
```

---

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detailnya.

---

## Author
**Valzyy**  
- [Homepage](https://www.jkt48connect.my.id)  
- [GitHub](https://github.com/Valzyy)

<a href='https://github.com/shivamkapasia0' target="_blank"><img alt='discord' src='https://img.shields.io/badge/Discord_Channel-100000?style=social&logo=discord&logoColor=82BAFD&labelColor=F4ECEC&color=2F2D2D'/></a>

---

Selamat menggunakan! Jangan ragu untuk melaporkan masalah atau mengusulkan fitur baru.
