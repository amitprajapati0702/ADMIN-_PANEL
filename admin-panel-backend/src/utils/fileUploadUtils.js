import HTTP_CODE from "../common/codeConstants.js";
import { RESPONSE_STATUS } from "../common/enumConstants.js";
import logger from "../common/logger.js";
import { getFileUrlExistOnS3, deleteImageFromS3, uploadToS3 } from "../services/fileUploadService.js";
import { performModelQuery } from "./commonUtils.js";
import axios from "axios";

const maxFileSize = 3;
const regex = /^data:(image\/\w+);base64,/;
/**
 * Check if the file size exceeds the maximum allowed size
 * @param {Buffer} buffer - The buffer containing the file data
 * @throws {Error} Throws an error if the file size exceeds the maximum allowed size
 */
const checkFileSize = (buffer) => {
  const fileSizeInBytes = buffer.length;
  // Convert bytes to megabytes
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  if (fileSizeInMB > maxFileSize) {
    throw new Error("File size too large.");
  }
};

/**
 * Common function to upload image on update function
 * @param {String} id - _id of document which we want to match with given value.
 * @param {String} modelName - The name of the mongoose model   
 * @param {String} image - the image field in which we need to update
 * @param {Any} fieldName - Value to be checked against the image  
 * @param {Object} templateData - the data in which we need to add our field.
 * @param {Boolean} isArray - tto check whether to upload multiple images or single images.
 * @param {String} settingField- optional parameter passed for image setup for settings
 * @returns {object} returns an object to upload on S3;
 */
export const handleImageUploadForUpdate = async (data, modelName, image, fieldName, templateData, isArray, folderName, res, settingField = '') => {
  try {
    if (image) {
      const match = image.match(regex);

      if (match && match.length > 1) {
        const base64Data = image.replace(regex, '');
        const buffer = Buffer.from(base64Data, 'base64');
        checkFileSize(buffer);
      }
      const result = await performModelQuery(modelName, "findOne", data);
      if (!result) {
        return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: "Data" });
      }
      const currentImageLink = result[fieldName];
      if (currentImageLink && currentImageLink.length > 0) {
        const currentKey = currentImageLink.split("amazonaws.com/");
        let awsImageKey = "";
        if (currentKey.length > 1) {
          awsImageKey = currentKey[1];
          await deleteImageFromS3(awsImageKey);
        }
      }
      try {
        await handleImageUploadForCreate(image, fieldName, templateData, isArray, folderName, res, settingField);
      } catch (error) {
        throw new Error(`Invaid ${fieldName} Data`)
      }
    }
  } catch (error) {
    logger.error("Error occurred while executing the handleImageUploadForUpdate " + error);
    throw new Error(`Invaid ${fieldName} Data`)

  }
};

/**
 * Common function to upload image on create function
 * @param {String} image - the image field in which we need to update
 * @param {Any} fieldName - Value to be checked against the image  
 * @param {Object} templateData - the data in which we need to add our field.
 * @param {Boolean} isArray - tto check whether to upload multiple images or single images.
 * @returns {object} returns an object to upload on S3;
 */
export const handleImageUploadForCreate = async (image, fieldName, templateData, isArray, folderName, res, settingField = '') => {
  try {
    if (image) {
      const imageData = isArray ? image[0] : image;
      const match = imageData.match(regex);
      if (match && match.length > 1) {
        const imageFileType = match[1];
        const base64Data = imageData.replace(regex, '');
        const buffer = Buffer.from(base64Data, 'base64');
        checkFileSize(buffer);
        const imageUploadResult = await uploadToS3(buffer, imageFileType, folderName);
        const imageKey = imageUploadResult.key;
        const imageLink = `${imageKey}`;
        if (settingField != '') {
          templateData[settingField] = imageLink;
        }
        else {
          templateData[fieldName] = imageLink;
        }
      } else {
        throw new Error("Invalid image data format");
      }
    }
  } catch (error) {
    logger.error("Error occurred while executing the handleImageUploadForCreate " + error);
    throw new Error(`Invaid ${fieldName} Data`)
  }
};

/**
 * Checks if an file exists in an item object based on the specified field.
 * If the file exists, returns the file URL; otherwise, returns an empty string.
 * @param {Object} item The item object containing the file URL.
 * @param {string} field The field in the item object containing the file URL.
 * @returns {Promise<string>} A Promise that resolves to the fo;e URL if it exists, otherwise an empty string.
 */
export const getFileUrlExist = async (item, field) => {
  logger.info("Starting execution of the getFileUrlExist");
  try {
    const imageRef = await axios.get(item[field]);
    if (imageRef.status >= 400) {
      return ""
    } else if (imageRef.data) {
      return item[field];
    } else {
      return "";
    }
  } catch (error) {
    logger.error("Error occurred while executing the getFileUrlExist");
    return ""
  }
}