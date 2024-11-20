function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 20; // Panjang API key
  let apiKey = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
}

// Contoh penggunaan
const newApiKey = generateApiKey();
console.log(`Generated API Key: ${newApiKey}`);
