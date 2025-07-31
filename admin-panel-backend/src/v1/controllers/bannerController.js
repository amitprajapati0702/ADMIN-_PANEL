import HTTP_CODE from "../../common/codeConstants.js";
import { isMongoObjectId, isPositiveNumber, isValidEnum, isValidUrl, newRequiredFieldsValidation, requiredFieldsValidation } from "../../common/validation.js";
import { BANNER_TYPES, RESPONSE_STATUS, STATUSES, LOBBY_BANNER_TYPES, LOBBY_GAME_TYPES } from "../../common/enumConstants.js";
import logger from "../../common/logger.js";
import { checKFieldValueExist, performModelQuery, softDeleteDocument, performAggregationQuery } from "../../utils/commonUtils.js";
import { getSearchFilterCondition } from "../../common/helper.js";
import Banner from '../models/bannerModel.js'
import { handleImageUploadForCreate, handleImageUploadForUpdate, getFileUrlExist } from "../../utils/fileUploadUtils.js";
const modelName = 'Banner';
const folderName = 'banner'
/**
 * Creates a banner data
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns nothing
 */
export const createBanner = async (req, res) => {
  const session = await Banner.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the createBanner");
    const { title, type, targetLink = "", image } = req.body;
    const adminId = req.admin.id;
    const requiredFields = ["title", "type", "image"];
    const uniqueField1 = 'title';
    const operation = 'create';

    // Validate if all fields are present in  the request body.
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isValidEnum(BANNER_TYPES, type)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_BANNER_TYPE");
    }

    if (!isValidUrl(targetLink)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Url" });
    }
    let isDataExist = await checKFieldValueExist(modelName, uniqueField1, title);
    if (isDataExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Title" });
    }
   
    let bannerData = { title, type, targetLink, createdBy: adminId };
    try {
      await handleImageUploadForCreate(image, 'image', bannerData, false, folderName, res);
    } catch (error) {
      logger.error("Error occurred while executing the createBanner " + error);
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "IMAGE_UPLOAD_FAILED");
    }
    const result = await performModelQuery(modelName, operation, bannerData);
    if (result) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_ADDED");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_ADD_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing the createBanner " + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG"
    );
  }
};

/**
 * Updates a banner data
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns nothing.
 */

export const updateBanner = async (req, res) => {
  const session = await Banner.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the updateBanner");
    const { id, title, type, targetLink = "", image = "" } = req.body;
    const adminId = req.admin.id;
    const requiredFields = ["id", "title", "type"];
    const uniqueField1 = 'title'
    const uniqueField2 = 'id';
    const operation = 'update';
    // Validate if all fields are present in  the request body.
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }
    if (!isValidEnum(BANNER_TYPES, type)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_BANNER_TYPE");
    }
    if (!isValidUrl(targetLink)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Url" });
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField2, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Banner' });
    }
    let isDataExist = await checKFieldValueExist(modelName, uniqueField1, title, id);
    if (isDataExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Title" });
    }

    let bannerData = { title, type, targetLink, updatedBy: adminId };
    
    const condition = { query: { _id: id } };
    try {
      if (image != '') {
        await handleImageUploadForUpdate(condition, "Banner", image, 'image', bannerData, false, folderName, res);
      }
    } catch (error) {
      logger.error("Error occurred while executing the updateBanner " + error);
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "IMAGE_UPLOAD_FAILED");
    }
    const data = { query: { _id: id }, update: bannerData };
    const result = await performModelQuery(modelName, operation, data);
    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_UPDATED");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing the updateBanner " + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves a list of all banner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns array of objects
 */

export const getAllBanner = async (req, res) => {
  try {
    logger.info("Starting execution of the getAllBanner");

    let { page = 1, limit = 10, type = "", isSearch = false, search1 = "", search2 = "", search3 = "" } = req.body;
    page = (isSearch) ? 1 : parseInt(page);
    limit = parseInt(limit);
    if (!isPositiveNumber(page)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Page" });
    }
    if (!isPositiveNumber(limit)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Limit" });
    }

    if (!isValidEnum(BANNER_TYPES, type)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_BANNER_TYPE");
    }

    let searchDataFilter = [];
    const searchFields = {
      "search1": { 'field': 'title', 'type': 'regex' },
      "search2": { 'field': 'status', 'type': 'equal', 'dataType': 'Number' }
    };
    searchDataFilter = await getSearchFilterCondition(searchFields, { search1, search2, search3 });
    let filteCondition = { type };
    if (searchDataFilter.length > 0) {
      filteCondition.$and = searchDataFilter
    }

    const lookupConfigs = []
    let projectionFields = {
      "_id": 1,
      "title": 1,
      "type": 1,
      "status": 1,
      "image": 1,
      "targetLink": 1
    };
    const sortConfig = { "createdAt": -1 };
    const matchCondition = { ...filteCondition };
    const unwindLookupIndices = [];
    const pageSize = limit;
    const pageNumber = page;
    const { result, totalPages, currentPage, totalCount, remainingCount } = await performAggregationQuery(modelName, lookupConfigs, projectionFields, sortConfig, matchCondition, pageSize, pageNumber, unwindLookupIndices);
    if (totalCount > 0) {
      let modifiedResult = await Promise.all(result.map(async (item) => {
          item.image = `${process.env.S3_URL}${item.image}`;
          return item;
        }));
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result: modifiedResult, totalPages, currentPage, totalCount, remainingCount });
    } else {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalPages, currentPage, totalCount, remainingCount });
    }

  } catch (error) {
    logger.error("Error occurred while executing the getAllBanner " + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves banner details by ID
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns object
 */

export const getBannerById = async (req, res) => {
  try {
    logger.info("Starting execution of the getBannerById");
    const { id } = req.body;
    const operation = 'findById';
    const uniqueField = 'id';

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Banner' });
    }

    const data = { id: id };
    const result = await performModelQuery(modelName, operation, data);
    if (result) {
      // result.image = await getFileUrlExist(result, "image");
      result.image = `${process.env.S3_URL}${result.image}`;
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", result);
    } else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "NO_DATA");
    }

  } catch (error) {
    logger.error("Error occurred while executing the getBannerById " + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates the status of collection
 * @param {Object} req - The request object. { status, ObjectId}
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateBannerStatus = async (req, res) => {
  const session = await Banner.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the updateBannerStatus function");
    const { status, id } = req.body;
    const adminId = req.admin.id;
    const uniqueField = 'id';
    const operation = 'updateStatus';

    if (!id || status == null) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_AND_STATUS_REQUIRED");
    }

    if (!isValidEnum(STATUSES, status)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_STATUS_TYPE");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Banner' });
    }

    const updateData = { query: { id }, update: { status, updatedBy: adminId } };
    const result = await performModelQuery(modelName, operation, updateData);

    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "STATUS_UPDATED");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }

  } catch (error) {
    logger.error("Error occurred while executing the updateBannerStatus\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * deletes the collection
 * @param {Object} req - The request object. { ObjectId}
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const softDeleteBanner = async (req, res) => {
  const session = await Banner.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the softDeleteBanner function");
    const { id } = req.body;
    const adminId = req.admin.id;
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }
    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }
    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Banner' });
    }

    const result = await softDeleteDocument(modelName, id, adminId);
    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_DELETED");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_DELETE_ERROR");
    }

  } catch (error) {
    logger.error("Error occurred while executing the softDeleteBanner\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};