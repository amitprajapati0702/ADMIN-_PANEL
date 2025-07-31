import { createRequire } from "module";
const require = createRequire(import.meta.url);
const enMessages = require("../../common/languages/enMessages.json");
const hiMessages = require("../../common/languages/hiMessages.json");

import logger from "../../common/logger.js";

/**
 * To replace msg for api response
 * @param {string} textMsg - original message string with {field1} {field2}
 * @param {Object} replaceWith - Object pattern {field1: value1, field2: value2,...}
 * @returns {string} returns the new message after replacing fields with values in it
 */
const replaceFieldText = (textMsg, replaceWith) => {
  if (Object.keys(replaceWith).length > 0) {
    for (const field in replaceWith) {
      if (replaceWith.hasOwnProperty(field)) {
        const regex = new RegExp("\\{" + field + "\\}", "g");
        textMsg = textMsg.replace(regex, replaceWith[field]);
      }
    }
  }
  return textMsg;
}
/**
 * sends the response to client
 * @param {Object} req - The request object.
 * @param {Object} res - The response object..
 * @returns {Promise<void>} returns response to client
 */
export const sendResponse = (req, res, next) => {
  logger.info('Starting execution of the sendResponse');
  res.sendResponse = (success, statusCode, messageCode, data, replaceMsgObj = {}) => {
    let language = req.header("language") || 'en';
    const messages = language === "hi" ? hiMessages : enMessages;
    let message = messages[messageCode] || enMessages[messageCode];
    //only if replaceObj pass
    if (Object.keys(replaceMsgObj).length > 0) {
      message = replaceFieldText(message, replaceMsgObj)
    }
    if (messageCode === "ALL_VALUES_REQUIRED" && replaceMsgObj && replaceMsgObj.fields) {
      message = replaceMsgObj.fields.map(field => {
        let convertedField = camelCaseToReadFormat(field)
        if (language === "hi") {
          return `${convertedField} फ़ील्ड आवश्यक है.`;
        } else {
          return `${convertedField} field is required.`;
        }
      }
      );
    }
    //FOR FANTASY RULE POINTS
    if (messageCode === "INVALID_OBJECT_ENUM" && replaceMsgObj && replaceMsgObj.fields) {
      message = replaceMsgObj.fields.map(field => {
        if (language === "hi") {
          return `${field} फ़ील्ड अमान्य है.`;
        } else {
          return `${field} field is invalid.`;
        }
      }
      );
    }
    if (messageCode === "DUPLICATE_OBJECT_ENUM" && replaceMsgObj && replaceMsgObj.fields) {
      message = replaceMsgObj.fields.map(field => {
        if (language === "hi") {
          return `डुप्लिकेट ${field} पारित की गईं!`;
        } else {
          return `Duplicate key ${field} passed.`;
        }
      }
      );
    }
    const responseData = {
      success,
      message,
    };
    if (data != [] && !Array.isArray(responseData.message)) {
      responseData.data = data;
    }
    res.status(statusCode).json(responseData);
  };
  return next();
};


/**
 * To convert camelcase to readable format string for validation
 * @param {String} field -  Field name in camel case
 * @returns {String} Returns Readable Format String
 */
const camelCaseToReadFormat = (field) => {
  let result = field.replace(/([A-Z])/g, ' $1');
  result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  return result;
}
