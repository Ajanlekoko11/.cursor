import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Encrypt data using AES-256
 */
export function encrypt(data: string, key?: string): string {
  const encryptionKey = key || ENCRYPTION_KEY;
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypt data using AES-256
 */
export function decrypt(encryptedData: string, key?: string): string {
  const encryptionKey = key || ENCRYPTION_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypt file/blob to Uint8Array
 */
export async function encryptFile(file: File | Blob, key?: string): Promise<Uint8Array> {
  const encryptionKey = key || ENCRYPTION_KEY;
  const arrayBuffer = await file.arrayBuffer();
  const data = Buffer.from(arrayBuffer).toString('base64');
  const encrypted = encrypt(data, encryptionKey);
  return new TextEncoder().encode(encrypted);
}

/**
 * Decrypt Uint8Array back to original data
 */
export async function decryptFile(encryptedData: Uint8Array, key?: string): Promise<Blob> {
  const encryptionKey = key || ENCRYPTION_KEY;
  const encrypted = new TextDecoder().decode(encryptedData);
  const decrypted = decrypt(encrypted, encryptionKey);
  const arrayBuffer = Buffer.from(decrypted, 'base64');
  return new Blob([arrayBuffer]);
}

