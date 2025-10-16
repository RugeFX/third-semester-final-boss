import { randomInt } from 'crypto';

// Karakter yang aman digunakan dalam kode pendek (menghindari karakter yang mirip)
const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Membuat kode alfanumerik acak yang pendek dan mudah dibaca.
 * @param {number} length - Panjang kode yang diinginkan (default: 6).
 * @returns {string} Kode acak yang dihasilkan.
 */
export const generateShortCode = (length: number = 6): string => {
    let result = '';
    // Lakukan perulangan sebanyak panjang kode yang diinginkan
    for (let i = 0; i < length; i++) {
        // Ambil satu karakter acak dari SAFE_CHARS dan tambahkan ke hasil
        result += SAFE_CHARS.charAt(randomInt(0, SAFE_CHARS.length));
    }
    
    return result;
};