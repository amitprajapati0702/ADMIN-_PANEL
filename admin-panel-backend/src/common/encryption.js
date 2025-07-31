import CryptoJS from "crypto-js";
import logger from "../common/logger.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * AES Decryption
 * @param {String} cipherText - encrypted string.
 * @returns {String} return plaintext
 */
export const decryptAES = (cipherText) => {
    try {
        logger.info('Starting execution of the decryptAES');
        // Parsing environment variables for AES key and IV
        const AESKEY = CryptoJS.enc.Utf8.parse(process.env.AES_KEY);
        const AESIV = CryptoJS.enc.Utf8.parse(process.env.AES_IV);

        // Ensure the key length is 256 bits (32 bytes)
        if (AESKEY.sigBytes !== 32) {
            throw new Error('AES key length is not 256 bits (32 bytes)');
        }

        // Decrypting the ciphertext
        var decrypted = CryptoJS.AES.decrypt(cipherText, AESKEY, {
            iv: AESIV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7 // Use PKCS7 padding
        });

        // Converting decrypted data to UTF-8 string
        const plainText = decrypted.toString(CryptoJS.enc.Utf8);

        return plainText;
    } catch (error) {
        logger.error('Error occurred while executing decryptAES\n' + error);
        return null;
    }
}


/**
 * AES Encryption
 * @param {String} text - text to be encrypted.
 * @returns {String} return ciphertext
 */
export const encryptAES = (text) => {
    try {
        logger.info('Starting execution of the encryptAES');
         // Parsing environment variables for AES key and IV
         const AESKEY = CryptoJS.enc.Utf8.parse(process.env.AES_KEY);
         const AESIV = CryptoJS.enc.Utf8.parse(process.env.AES_IV);
         
         // Ensure the key length is 256 bits (32 bytes)
         if (AESKEY.sigBytes !== 32) {
             throw new Error('AES key length is not 256 bits (32 bytes)');
         }
         
         var encrypted = CryptoJS.AES.encrypt(text, AESKEY, {
             iv: AESIV,
             mode: CryptoJS.mode.CBC, // Set the mode to CBC
             padding: CryptoJS.pad.Pkcs7 // Use PKCS7 padding
         });
         
         const cipherText = encrypted.toString();
         return cipherText;
    } catch (error) {
        logger.error('Error occurred while executing encryptAES\n' + error);
        return null;
    }
}