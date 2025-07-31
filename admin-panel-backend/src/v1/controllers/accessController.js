
import HTTP_CODE from "../../common/codeConstants.js";
import { RESPONSE_STATUS, STATUSES } from "../../common/enumConstants.js";
import { checKFieldValueExist, performAggregationQuery, performModelQuery, softDeleteDocument } from "../../utils/commonUtils.js";
import { isMongoObjectId, isPositiveNumber, isValidEnum, newRequiredFieldsValidation } from "../../common/validation.js";
import logger from "../../common/logger.js";
import Permission from '../models/permissionModel.js';
import Role from '../models/roleModel.js'
import { getSearchFilterCondition } from "../../common/helper.js";

/**
 * creates new permission
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns nothing
 */
export const createPermission = async (req, res) => {
  const session = await Permission.startSession();
  session.startTransaction();
  try {
    logger.info('Starting execution of the addPermission');
    const requiredFields = ["title", "description"]
    const { title, description } = req.body;
    const createdBy = req.admin.id;
    const modelName = 'Permission';
    const uniqueField = 'title';
    const operation = 'create';

    const permissionData = { title, description, createdBy }
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }
    const isDataExist = await checKFieldValueExist(modelName, uniqueField, title);

    if (isDataExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Title" });
    }

    const result = await performModelQuery(modelName, operation, permissionData);

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
    logger.error('Error occurred while executing the addPermission\n' + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * fetch all the permissions
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns array of objects
 */
export const getAllPermissions = async (req, res) => {
  try {
    logger.info('Starting execution of the getAllPermissions');
    let selectFields = { pid: 1, name: 1, codename: 1, parentId: 1 };
    let sortBy = ['pid:asc'];
    const query = { status: 1 }
    const data = {
      query,
      selectFields,
      sortBy
    }
    const modelName = 'Permission';
    const operation = 'readAll';
    const { result, totalPages, currentPage, totalCount, remainingCount } = await performModelQuery(modelName, operation, data);
    if (totalCount > 0) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result, totalPages, currentPage, totalCount, remainingCount });
    } else {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalPages, currentPage, totalCount, remainingCount });
    }
  } catch (error) {
    logger.error('Error occurred while executing the getAllPermissions\n' + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Deletes the collection
 * @param {Object} req - The request object. { ObjectId}
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const softDeletePermission = async (req, res) => {
  const session = await Permission.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the softDeletePermission function");
    const { id } = req.body;
    const adminId = req.admin.id;
    const modelName = "Permission";
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }
    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }
    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Permission' });
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
    logger.error("Error occurred while executing the softDeletePermission\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * creates new role
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns nothing
 */
export const createRole = async (req, res) => {
  const session = await Role.startSession();
  session.startTransaction();
  try {
    logger.info('Starting execution of the addRole');
    const requiredFields = ["name", "description", "access"]
    const { name, description, access } = req.body;
    const createdBy = req.admin.id;
    const modelName = 'Role';
    const operation = 'create';
    const uniqueField1 = 'name';
    const uniqueField2 = 'id';

    const roleData = { name, description, access, createdBy }
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    let isDataExist = await checKFieldValueExist(modelName, uniqueField1, name);
    if (isDataExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Name" });
    }

    const isOkArray = await Promise.all(access.map(async (id) => {
      const check = await checKFieldValueExist('Permission', uniqueField2, id);
      return check;
    }));

    const isOk = isOkArray.every(check => check);

    if (!isOk) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Permission Id' });
    }


    const result = await performModelQuery(modelName, operation, roleData);
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
    logger.error('Error occurred while executing the addRole\n' + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * fetch all roles
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns object
 */
export const getAllRoles = async (req, res) => {
  try {
    logger.info('Starting execution of the getAllRoles');
    const modelName = "Role";
    let { page = '*', limit = 10, isSearch = false, search1 = "", search2 = '' } = req.body;
    let operation = 'read';
    if (page != '*') {
      page = (isSearch) ? 1 : parseInt(page);
      limit = parseInt(limit);
      if (!isPositiveNumber(page)) {
        return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Page" });
      }
      if (!isPositiveNumber(limit)) {
        return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Limit" });
      }
    } else {
      //if we required all records in listing then make operation as readAll.
      operation = 'readAll';
    }

    let searchDataFilter = [];

    const searchFields = {
      "search1": { 'field': 'name', 'type': 'regex' },
      "search2": { 'field': 'status', 'type': 'equal', 'dataType': 'Number' }
    };
    searchDataFilter = await getSearchFilterCondition(searchFields, { search1, search2 });
    let filteCondition = {};
    if (searchDataFilter.length > 0) {
      filteCondition.$and = searchDataFilter
    }

    const lookupConfigs = [
      {
        from: "permissions",
        localField: "access",
        foreignField: "_id",
        as: "permissionData"
      },
    ];

    const projectionFields = {
      "_id": 1,
      "name": 1,
      "description": 1,
      "status": 1,
      "permissions": {
        $map: {
          input: "$permissionData",
          as: "permission",
          in: {
            _id: "$$permission._id",
            codeName: "$$permission.codename"
          }
        }
      }
    };

    const sortConfig = { "_id": -1 };
    const matchCondition = { ...filteCondition };
    const unwindLookupIndices = [];
    const pageSize = limit;
    const pageNumber = page;
    const { result, totalPages, currentPage, totalCount, remainingCount } = await performAggregationQuery(modelName, lookupConfigs, projectionFields, sortConfig, matchCondition, pageSize, pageNumber, unwindLookupIndices);
    if (totalCount > 0) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result, totalPages, currentPage, totalCount, remainingCount });
    } else {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalPages, currentPage, totalCount, remainingCount });
    }

  } catch (error) {
    logger.error('Error occurred while executing the getAllRoles\n' + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates an existing role.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateRole = async (req, res) => {
  const session = await Role.startSession();
  session.startTransaction();
  try {
    const requiredFields = ["id", "name", "description", "access"]
    logger.info('Starting execution of the updateRole');

    const {
      id,
      name,
      description,
      access
    } = req.body;

    const updatedBy = req.admin.id;
    const modelName = 'Role';
    const operation = 'update';
    const uniqueField1 = 'id';
    const uniqueField2 = 'name';

    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField1, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
    }

    const isOkArray = await Promise.all(access.map(async (id) => {
      const check = await checKFieldValueExist('Permission', uniqueField1, id);
      return check;
    }));

    const isOk = isOkArray.every(check => check);

    if (!isOk) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Permission id' });
    }

    //check s whether the provided role already exists or not.
    let isDataExist = await checKFieldValueExist(modelName, uniqueField2, name, id);
    if (isDataExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Name" });
    }
    const data = {
      query: { _id: id },
      update: { name, description, access, updatedBy }
    };

    const result = await performModelQuery(modelName, operation, data);

    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_UPDATED",);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR",);
    }
  } catch (error) {
    logger.error('Error occurred while exectuing updateRole\n' + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves role details by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns object
 */
export const getRoleById = async (req, res) => {
  try {
    logger.info("Starting execution of the getRoleById");

    const { id } = req.body;
    const modelName = 'Role';
    const operation = 'findOne';
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
    }

    const query = { _id: id };
    const roleDetails = await performModelQuery(modelName, operation, { query });

    if (roleDetails) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", roleDetails);
    } else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "NO_DATA");
    }
  } catch (error) {
    logger.error("Error occurred while executing getAdminById\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Update status of role (0 or 1)
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns nothing
 */
export const updateRoleStatus = async (req, res) => {
  const session = await Role.startSession();
  session.startTransaction();
  try {
    logger.info('Starting execution of the updateRoleStatus');
    const { status, id } = req.body;
    const updatedBy = req.admin.id;
    const modelName = 'Role';
    const operation = 'updateStatus';
    const uniqueField = 'id';

    if (!id || status == null) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_AND_STATUS_REQUIRED",);
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
    }

    if (!isValidEnum(STATUSES, status)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_STATUS",);
    }

    const updateData = {
      query: { id },
      update: { status, updatedBy },
    };

    const result = await performModelQuery(modelName, operation, updateData);
    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "STATUS_UPDATED",);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR",);
    }
  } catch (error) {
    logger.error('Error occurred while executing the updateRoleStatus\n' + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};


/**
 * Deletes the collection
 * @param {Object} req - The request object. { ObjectId}
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const softDeleteRole = async (req, res) => {
  const session = await Role.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the softDeleteRole function");
    const { id } = req.body;
    const adminId = req.admin.id;
    const modelName = 'role';
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);
    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
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
    logger.error("Error occurred while executing the softDeleteRole\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};