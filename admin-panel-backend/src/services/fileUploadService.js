import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import logger from '../common/logger.js';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.S3_SECRET_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY
  },
  region: process.env.S3_REGION
});
/**
 * Adds an image from Amazon S3.
 * @param {fileData} - The file to be uploaded.
 * @param {fileType} - The file type example: 'image/png'.
 * @returns {Object} - Returning data and its image key.
 */

export const uploadToS3 = async (fileData, fileType, folderName) => {
  try {
    const keyName = `${folderName}/${uuidv4()}.${fileType.split('/')[1]}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: keyName,
      Body: fileData,
      ContentType: fileType,
      ContentDisposition: 'inline',
    };
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    const key = params.Key;
    return { data, key };
  } catch (error) {
    logger.error("Error occurred while executing the uploadToS3 " + error);
    throw error;
  }
};

/**
 * Deletes an image from Amazon S3.
 * @param {string} key - The key of the image to be deleted.
 * @returns {Promise<void>} - A Promise indicating the success or failure of the operation.
 */

export async function deleteImageFromS3(key) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const getResponse = await getFileUrlExistOnS3(key);
    if (getResponse) {
      await s3.send(deleteCommand);
      logger.info(`Image with key ${key} deleted successfully from Amazon S3.`);
    }
  } catch (err) {
    if (err.name === 'NoSuchKey') {
      logger.info(`No entry found for image with key ${key} in Amazon S3.`);
    } else {
      logger.error("Error deleting image from Amazon S3: " + err);
      throw err;
    }
  }
}

/**
 * check file exist on Amazon S3.
 * @param {string} key - The key of the file to be deleted.
 * @returns {Promise<void>} - A Promise indicating the success or failure of the operation.
 */
export async function getFileUrlExistOnS3(key) {
  const getCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const getResponse = await s3.send(getCommand);
    if (getResponse) {
      logger.info(`file with key ${key} fetched successfully from Amazon S3.`);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.info(`No entry found for file with key ${key} in Amazon S3.`);
    return false;
  }
}
