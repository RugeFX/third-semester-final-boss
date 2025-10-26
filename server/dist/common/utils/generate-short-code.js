import { randomInt } from "crypto";
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const generateShortCode = (length = 6) => {
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
//# sourceMappingURL=generate-short-code.js.map