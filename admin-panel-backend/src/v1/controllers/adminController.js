import HTTP_CODE from "../../common/codeConstants.js";
import { RESPONSE_STATUS, STATUSES } from "../../common/enumConstants.js";
import Admin from "../models/adminModel.js";

import {
  loginAdminUtils,
  // updatePasswordUtils,
  verifyCodeUtils,
  triggerForgetPwdCodeUtils,
  forgetPasswordUtils,
  forceUpdatePass,
} from "../../utils/adminUtils.js";
import { checKFieldValueExist, performAggregationQuery, performModelQuery, softDeleteDocument } from "../../utils/commonUtils.js";
import {
  isEmail,
  isMongoObjectId,
  isPassword,
  validateIndianPhoneNumber,
  isPositiveNumber,
  isString,
  isValidEnum,
  maxEmailLength,
  newRequiredFieldsValidation,
} from "../../common/validation.js";
import logger from "../../common/logger.js";
import {
  generateUniqueReferralCode,
  getSearchFilterCondition,
} from "../../common/helper.js";
import moment from "moment";

const TIME_ZONE = process.env.TIME_ZONE || "Asia/Kolkata";
const modelName = 'Admin';
import bcrypt from "bcrypt";
/**
 * Creates a new admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const createAdmin = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the createAdmin");

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "role",
    ];

    let {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      role,
    } = req.body;
    const adminId = req.admin.id;
    email = email.toLowerCase();
    const operation = 'create';
    const uniqueField1 = 'phone';
    const uniqueField2 = 'email';
    const uniqueField3 = 'id';
    const refModel = 'Role'

    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }


    if (password !== confirmPassword) {
      return res.sendResponse(
        RESPONSE_STATUS.ERROR,
        HTTP_CODE.OK,
        "PASSWORD_MISMATCH"
      );
    }

    if (!isMongoObjectId(role)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    if (!validateIndianPhoneNumber(phone)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Phone" });
    }

    const isPhoneExist = await checKFieldValueExist(modelName, uniqueField1, phone);
    if (isPhoneExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Mobile number" });
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }
    if(maxEmailLength(email)){
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "LENGTH_LIMIT_EXCEEDED", [], { field1: 'Email', length: '100' });
    }
    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    const isEmailExist = await checKFieldValueExist(modelName, uniqueField2, email);
    if (isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "VALUE_ALREADY_EXIST", [], { field1: "Email" });
    }

    const isRoleIdExist = await checKFieldValueExist(refModel, uniqueField3, role);

    if (!isRoleIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
    }

    const data = {
      firstName,
      lastName,
      email,
      phone,
      roleId: role,
      password,
      pwdExpiryDate: moment().add(5, "minutes"),
      createdBy: adminId,
    };

    const result = await performModelQuery(modelName, operation, data);


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
    logger.error("Error occurred while executing createAdmin\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Logs in an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns object
 */
export const loginAdmin = async (req, res) => {
  try {
    logger.info("Starting execution of the loginAdmin");
    logger.info("fn:loginAdmin REQ BODY :::  :::\n" + JSON.stringify(req.body));
    let { email, password } = req.body;
    if (!email || !password) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "EMAIL_AND_PASSWORD_REQUIRED");
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    email = email.toLowerCase();
    const result = await loginAdminUtils(email, password);
    logger.info("fn:loginAdminUtils result :::\n" + JSON.stringify(result));

    if (result.isValid && result.isAuth) {
      const data = result.data;
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "ADMIN_LOGGED_IN_SUCCESSFULLY", { token: result.token, isModel: result.isModel, ...data });
    } else if (result.isAuth != null && !result.isAuth) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "UNAUTHORIZED_ADMIN");
    }
    else if (result.isModel != null && result.isModel) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "RESET_PASSWORD_MODEL", { isModel: result.isModel, email: result.email });
    }
    else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_CREDENTIALS");
    }
  } catch (error) {
    logger.error("Error occurred while executing loginAdmin\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates an existing admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateAdmin = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the updateAdmin");
    const requiredFields = ["adminId", "firstName", "lastName", "roleId"];
    const uniqueField = 'id'
    const refModel = 'Role';

    const { adminId, firstName, lastName, roleId } = req.body;

    const updatedBy = req.admin.id;
    const operation = 'update';

    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isMongoObjectId(adminId)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, adminId);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
    }

    let isRoleIdExist = await checKFieldValueExist(refModel, uniqueField, roleId);

    if (!isRoleIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Role' });
    }

    const data = {
      query: { _id: adminId },
      update: { firstName, lastName, roleId, updatedBy },
    };

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
    logger.error("Error occurred while exectuing updateAdmin\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};


/**
 * Updates the profile of an existing admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateAdminProfile = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the updateAdminProfile");
    const requiredFields = ["firstName", "lastName", "address"];

    const { firstName, lastName, address } = req.body;

    const id = req.admin.id;
    const operation = 'update';

    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }
    if (!isString(firstName)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "First name" });
    }
    if (!isString(lastName)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Last name" });
    }
    if (!isString(address)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Address" });
    }

    const data = {
      query: { _id: id },
      update: { firstName, lastName, address, updatedBy: id },
    };

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
    logger.error("Error occurred while exectuing updateAdminProfile\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves a list of all admins.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns array of object
 */

export const getAllAdmin = async (req, res) => {

  try {
    logger.info("Starting execution of the getAllAdmin");

    let { page = 1, limit = 10, isSearch = false, search1 = "", search2 = "", search3 = "", search4 = "", search5 = "", search6 = "" } = req.body;
    page = (isSearch) ? 1 : parseInt(page);
    limit = parseInt(limit);
    if (!isPositiveNumber(page)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Page" });
    }
    if (!isPositiveNumber(limit)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Limit" });
    }

    let searchDataFilter = [];
    const searchFields = {
      "search1": { 'field': 'firstName', 'type': 'regex' },
      "search2": { 'field': 'lastName', 'type': 'regex' },
      "search3": { 'field': 'email', 'type': 'regex' },
      "search4": { 'field': 'phone', 'type': 'regex' },
      "search5": { 'field': 'roleData._id', 'type': 'equal', 'dataType': 'Object' },
      "search6": { 'field': 'status', 'type': 'equal', 'dataType': 'Number' },
    };
    searchDataFilter = await getSearchFilterCondition(searchFields, { search1, search2, search3, search4, search5, search6 });
    let filteCondition = {};
    if (searchDataFilter.length > 0) {
      filteCondition.$and = searchDataFilter
    }

    const lookupConfigs = [
      {
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "roleData"
      }
    ];
    const projectionFields = {
      "_id": 1,
      "fullName": 1,
      "firstName": 1,
      "lastName": 1,
      "email": 1,
      "phone": 1,
      "status": 1,
      "isHead": 1,
      "createdAt": {
        $dateToString: {
          format: "%Y-%m-%dT%H:%M:%S.%LZ",
          date: "$createdAt",
          timezone: TIME_ZONE
        }
      },
      "roleData": {
        $map: {
          input: "$roleData",
          as: "role",
          in: {
            _id: "$$role._id",
            name: "$$role.name",
            access: "$$role.access"
          }
        }
      }
    };

    const sortConfig = { "createdAt": -1 };
    const matchCondition = { ...filteCondition };
    const pageSize = limit;
    const pageNumber = page;
    const unwindLookupIndices = [];
    const { result, totalPages, currentPage, totalCount, remainingCount } = await performAggregationQuery(modelName, lookupConfigs, projectionFields, sortConfig, matchCondition, pageSize, pageNumber, unwindLookupIndices);
    if (totalCount > 0) {
      const roles = await performModelQuery('Role', 'readAll', { selectFields: { _id: 1, name: 1 } });
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result, roleData : roles.result, totalPages, currentPage, totalCount, remainingCount });
    } else {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalPages, currentPage, totalCount, remainingCount });
    }
  } catch (error) {
    logger.error("Error occurred while executing getAllAdmin\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves admin details by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns object
 */
export const getAdminById = async (req, res) => {
  try {
    logger.info("Starting execution of the getAdminById");

    const { id } = req.body;
    const operation = 'readAll'
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
    }

    const selectFields = { firstName: 1, lastName: 1, email: 1, phone: 1, address: 1, roleId: 1, status: 1, createdAt: 1 }
    const data = {
      selectFields,
      query: { _id: id },
      populate: [
        {
          path: 'roleId',
          select: "name"
        }
      ]
    }
    const finalReponse = await performModelQuery(modelName, operation, data);
    if (finalReponse) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", finalReponse?.result[0]);
    } else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "NO_DATA");
    }

  } catch (error) {
    logger.error("Error occurred while executing getAdminById\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates the password of an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updatePassword = async (req, res) => {

  const session = await Admin.startSession();
  session.startTransaction();

  try {
    logger.info("Starting execution of the updatePassword");
    const requiredFields = ["adminId", "originalPassword", "password", "confirmPassword"];
    const { adminId, originalPassword, password, confirmPassword } = req.body;
    const admin = req.admin;
    const currentAdminId = admin.id;
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    if (password !== confirmPassword) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PASSWORD_MISMATCH");
    }

    if (originalPassword == password) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "SAME_PASSWORD");
    }

    const adminDetails = await performModelQuery(modelName, 'findOne', { query: { _id: adminId }, selectFields: { password: 1 } });
    if (!adminDetails) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_ADMIN", [], { field1: "Admin" });
    }

    const isPasswordMatched = bcrypt.compareSync(originalPassword, adminDetails.password);

    if (!isPasswordMatched) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD");
    }

    const data = {
      query: { _id: adminId },
      update: { password, updatedBy: currentAdminId },
    };

    const isSuccess = await performModelQuery(modelName, 'update', data);

    if (isSuccess) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "PASSWORD_UPDATED_SUCCESSFULLY");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD");
    }
  } catch (error) {
    logger.error("Error occurred while executing updatePassword\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * resets the password of an admin if password is expired or the staff is login for first time.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const forceUpdatePassword = async (req, res) => {

  const session = await Admin.startSession();
  session.startTransaction();

  try {
    logger.info("Starting execution of the forceUpdatePassword");

    const requiredFields = ["email", "originalPassword", "password", "confirmPassword"];

    const { email, originalPassword, password, confirmPassword } = req.body;
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    if (password !== confirmPassword) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PASSWORD_MISMATCH");
    }

    if (originalPassword == password) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "SAME_PASSWORD");
    }

    let isEmailExist = await checKFieldValueExist(modelName, "email", email);
    if (!isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    const { status } = await forceUpdatePass(
      email,
      originalPassword,
      password
    );

    if (status == true) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "PASSWORD_UPDATED_SUCCESSFULLY");
    } else if (status == "invalid") {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }
    else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD");
    }
  } catch (error) {
    logger.error("Error occurred while executing forceUpdatePassword\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates the password of  staff.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateStaffPassword = async (req, res) => {

  const session = await Admin.startSession();
  session.startTransaction();

  try {
    logger.info("Starting execution of the updateStaffPassword");

    const requiredFields = ["id", "password", "confirmPassword"];
    const operation = "update";
    const uniqueField = "id";

    const { id, password, confirmPassword } = req.body;
    const updatedBy = req.admin.id;
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    if (password !== confirmPassword) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PASSWORD_MISMATCH");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
    }

    const data = {
      query: { _id: id },
      update: { password, updatedBy },
    };

    const result = await performModelQuery(modelName, operation, data);
    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "PASSWORD_UPDATED_SUCCESSFULLY");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing updateStaffPassword\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Resets own password of staff.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const resetPassword = async (req, res) => {

  const session = await Admin.startSession();
  session.startTransaction();

  try {
    logger.info("Starting execution of the resetPassword");

    const requiredFields = ["password", "confirmPassword"];
    const operation = "update";

    const { password, confirmPassword } = req.body;
    const adminId = req.admin.id;
    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }

    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    if (password !== confirmPassword) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PASSWORD_MISMATCH");
    }

    const data = {
      query: { _id: adminId },
      update: { password, updatedBy: adminId },
    };

    const result = await performModelQuery(modelName, operation, data);
    if (result.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "PASSWORD_RESET");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing resetPassword\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Generates a password reset code for an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const generateForgetPwdCode = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the generateForgetPwdCode");

    const { email } = req.body;


    const uniqueField = 'email';

    if (!email) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "EMAIL_REQUIRED");
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    let isEmailExist = await checKFieldValueExist(modelName, uniqueField, email);

    if (!isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    const randomCode = await triggerForgetPwdCodeUtils(email);

    if (randomCode) {
      await session.commitTransaction();
      session.endSession();
      const result = { code: randomCode };
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "EMAIL_SENT", result);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "EMAIL_SENDING_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing generateForgetPwdCode\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Verifies reset code of an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const verifyCode = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the verifyCode");

    const { otp, email } = req.body;
    const uniqueField = 'email';

    if (!email || !otp) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "EMAIL_AND_OTP_REQUIRED");
    }

    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    let isEmailExist = await checKFieldValueExist(modelName, uniqueField, email);

    if (!isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    const result = await verifyCodeUtils(email, otp);

    if (result) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "OTP_VERIFIED");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "OTP_INVALID");
    }

  } catch (error) {
    logger.error("Error occurred while executing verifyCode\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
}

/**
 * Resets the password for an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const forgetPassword = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the ForgetPassword");

    const requiredFields = ["password", "confirmPassword", "email"];

    const uniqueField = 'email';

    const { password, confirmPassword, email } = req.body;


    const missingFields = newRequiredFieldsValidation(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: missingFields });
    }


    if (!isEmail(email)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    if (!isPassword(password) || !isPassword(confirmPassword)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_PASSWORD_VALIDATION", [], { field1: "Password or confirm password" });
    }

    if (password !== confirmPassword) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PASSWORD_MISMATCH");
    }

    let isEmailExist = await checKFieldValueExist(modelName, uniqueField, email);

    if (!isEmailExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: "Email" });
    }

    const isUpdated = await forgetPasswordUtils(
      email,
      password
    );

    if (isUpdated) {
      await session.commitTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "PASSWORD_RESET");
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "DATA_UPDATE_ERROR");
    }
  } catch (error) {
    logger.error("Error occurred while executing ForgetPassword\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Updates the status of an admin (1 or 0).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns nothing
 */
export const updateAdminStatus = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the updateAdminStatus function");

    const { status, id } = req.body;

    const updatedBy = req.admin.id;

    const operation = 'updateStatus';

    const uniqueField = 'id';

    if (!id || status == null) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_AND_STATUS_REQUIRED");
    }

    if (!isValidEnum(STATUSES, status)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_STATUS");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
    }

    const updateData = {
      query: { id },
      update: { status, updatedBy },
    };

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
    logger.error("Error occurred while executing the updateAdminStatus\n" + error);
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
export const softDeleteAdmin = async (req, res) => {
  const session = await Admin.startSession();
  session.startTransaction();
  try {
    logger.info("Starting execution of the softDeleteAdmin function");
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
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
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
    logger.error("Error occurred while executing the softDeleteAdmin\n" + error);
    await session.abortTransaction();
    session.endSession();
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Retrieves current admin details.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - returns object
 */
export const getAdminProfile = async (req, res) => {
  try {
    logger.info("Starting execution of the getAdminProfile");

    const id = req.admin.id;
    const operation = 'readAll'
    const uniqueField = 'id';

    if (!id) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ID_REQUIRED");
    }

    if (!isMongoObjectId(id)) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_OBJECT_ID");
    }

    let isIdExist = await checKFieldValueExist(modelName, uniqueField, id);

    if (!isIdExist) {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_RECORD", [], { field1: 'Admin' });
    }

    const selectFields = { firstName: 1, lastName: 1, email: 1, phone: 1, address: 1, roleId: 1, status: 1, createdAt: 1 }
    const data = {
      selectFields,
      query: { _id: id },
      populate: [
        {
          path: 'roleId',
          select: "name"
        }
      ]
    }
    const finalReponse = await performModelQuery(modelName, operation, data);
    if (finalReponse) {
      return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", finalReponse?.result[0]);
    } else {
      return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "NO_DATA");
    }

  } catch (error) {
    logger.error("Error occurred while executing getAdminProfile\n" + error);
    return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};