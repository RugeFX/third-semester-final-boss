import { randomInt } from "crypto";

// Karakter yang aman digunakan dalam kode pendek (menghindari karakter yang mirip)
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Membuat kode alfanumerik acak yang pendek dan mudah dibaca.
 * @param {number} length - Panjang kode yang diinginkan (default: 6).
 * @returns {string} Kode acak yang dihasilkan.
 */
export const generateShortCode = (length: number = 6): string => {
    if (!Number.isInteger(length) || length <= 0 || length > 64) {
        throw new RangeError("length must be an integer between 1 and 64");
    }

    const poolLen = SAFE_CHARS.length;

    let result = "";

    for (let i = 0; i < length; i++) {
        result += SAFE_CHARS.charAt(randomInt(0, poolLen));
    }
    
    return result;
};
