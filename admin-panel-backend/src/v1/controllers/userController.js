import UserModel from "../models/userModel.js";
import HTTP_CODE from "../../common/codeConstants.js";
import { RESPONSE_STATUS, STATUSES } from "../../common/enumConstants.js";
import { checKFieldValueExist, checKFieldValueExistForDeletedUser,performAggregationQuery, performModelQuery, performModelQueryForDeletedUser } from "../../utils/commonUtils.js";
import mongoose from "mongoose";
import {
  isEmail,
  isMongoObjectId,
  validateIndianPhoneNumber,
  isPositiveNumber,
  isString,
  isValidEnum,
  maxEmailLength,
  newRequiredFieldsValidation,
} from "../../common/validation.js";
import logger from "../../common/logger.js";
import {
  generateRandomMSalt,
  generateRandomMkey,
  generateUniqueReferralCode,
  getSearchFilterCondition,
} from "../../common/helper.js";
import { encryptAES, decryptAES } from "../../common/encryption.js";
const modelName = 'User';

const TIME_ZONE = process.env.TIME_ZONE || "Asia/Kolkata";
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const createUser = async (req, res) => {
  const session = await UserModel.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the createUser");

    const requiredFields = [
      "username",
      "email",
      "phone"
    ];

    const refModel = 'User'

    const {
      username, email, phone
    } = req.body;
    const adminId = req.admin.id;

    const operation = 'create';
    const uniqueField1 = 'phone';
    const uniqueField2 = 'email';

    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!validateIndianPhoneNumber(phone)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Phone" });
    }

    const isPhoneExist = await checKFieldValueExist(refModel, uniqueField1, phone);
    if (isPhoneExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Mobile number" });
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }
    if(maxEmailLength(email)){
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "LENGTH_LIMIT_EXCEEDED", [], { field1: 'Email', length: '100' });
    }
    const isEmailExist = await checKFieldValueExist(refModel, uniqueField2, email);
    if (isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Email" });
    }
    const randomMkey = generateRandomMkey();
    const randomMsalt = generateRandomMSalt();

    const data = {
      username,
      email,
      phone,
      referralCode: generateUniqueReferralCode(),
      mkey: encryptAES(randomMkey),
      msalt: encryptAES(randomMsalt),
      createdBy: adminId,
      userGamingId: uuidv4(),
    };

    const result = await performModelQuery(refModel, operation, data);
    if (result) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_ADDED");
    }
    else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_ADD_ERROR");
    }

  } catch (error) {
    logger.error("Error occurred while executing createUser\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
}

/**
 * Retrieves a list of all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns array of object
 */
export const getAllUsers = async (req, res) => {
  logger.info("Starting execution of the getAllUsers");
  try {
    let { page = 1, limit = 10, isSearch = false, search1 = "", search2 = '', search3 = '', search4 = '', search5 = '' } = req.body;
    const refModel = 'User';
    let operation = 'read';
    page = (isSearch) ? 1 : parseInt(page);
    limit = parseInt(limit);
    
    if (!isPositiveNumber(page)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Page" });
    }
    if (!isPositiveNumber(limit)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Limit" });
    }

    let query = { $and: [] };
    let sortBy = ["createdAt:desc"];
    let searchFields = {
      "search1": { 'field': 'createdAt', 'type': 'date', 'dataType': 'range', 'format': "MM/DD/YYYY" },
      "search2": { 'field': 'username', 'type': 'regex' },
      "search3": { 'field': 'phone', 'type': 'regex' },
      "search5": { 'field': 'email', 'type': 'regex' }
    };

    if (search4 === 'active') {
      query.$and.push({
        "isBlocked.blockWithdrawal": 0,
        "isBlocked.blockUser": 0,
        "deletedAt": null
      });
    } else if (search4 === 'delete') {
      query.$and.push({
        "deletedAt": { $ne: null }
      });
    } else if (search4 !== '') {
      searchFields["search4"] = { 'field': 'isBlocked', 'type': 'objectField', 'dataType': 'Object' };
    }

    const searchDataFilter = await getSearchFilterCondition(searchFields, { search1, search2, search3, search4, search5 });

    if (searchDataFilter.length > 0) {
      query.$and.push(...searchDataFilter);
    }

    if (query.$and.length === 0) {
      query = {};
    }

    const selectFields = {
      username: 1,
      email: 1,
      phone: 1,
      city: 1,
      createdAt: {
        $dateToString: {
          format: "%Y-%m-%dT%H:%M:%S.%LZ",
          date: "$createdAt",
          timezone: TIME_ZONE
        }
      },
      status: 1,
      isBlocked: 1,
      deletedAt: 1
    };
    const data = { page, limit, selectFields, sortBy, query };

    const { result, totalPages, currentPage, totalCount, remainingCount } = await performModelQueryForDeletedUser(refModel, operation, data);
    if (totalCount > 0) {
      let modifiedResult = await Promise.all(result.map(async (val) => {
        return {
          ...val._doc
        };
      }));
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result: modifiedResult, totalPages, currentPage, totalCount, remainingCount });
    } else {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalPages, currentPage, totalCount, remainingCount });
    }

  } catch (error) {
    logger.error("Error occurred while executing getAllUsers\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves User details by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns object
 */
export const getUserById = async (req, res) => {
  logger.info("Starting execution of the getUserById");
  try {
    const { id } = req.body;
    const operation = 'readAll';
    const uniqueField = 'id';
    const refModel = 'User'

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(refModel, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'User' });
    }

    const selectFields = {
      username: 1,
      email: 1,
      phone: 1,
      city: 1,
      createdAt: {
        $dateToString: {
          format: "%Y-%m-%dT%H:%M:%S.%LZ",
          date: "$createdAt",
          timezone: TIME_ZONE
        }
      },
      status: 1,
      isBlocked: 1
    }
    const data = {
      selectFields,
      query: { _id: id }
    }
    const finalReponse = await performModelQuery(refModel, operation, data);
    if (finalReponse) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", finalReponse?.result[0]);
    } else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "NO_DATA");
    }
  } catch (error) {
    logger.error("Error occurred while executing getUserById\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

