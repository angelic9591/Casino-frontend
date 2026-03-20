import CryptoJS from 'crypto-js';

export function verifyResult(serverSeed, clientSeed, nonce) {
  const message = `${clientSeed}:${nonce}`;

  // HMAC SHA256
  const hash = CryptoJS.HmacSHA256(message, serverSeed).toString();

  // Convert hex → number
  const number = parseInt(hash.substring(0, 8), 16);

  // Convert to 0–100
  return (number % 10000) / 100;
}