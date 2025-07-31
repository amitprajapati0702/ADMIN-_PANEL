import moment from "moment";
import { generateRandomCode } from "../common/helper.js";
import logger from "../common/logger.js";
import Admin from "../v1/models/adminModel.js";

const PWD_EXPIRE_TIME = 3;
const PWD_EXPIRE_UNIT = "months";

/**
 * finds existing admin with object id
 * @param {ObjectId} identifier - Object id of document.
 * @returns {Promise<void>}- returns object
 */
export const findExistingAdminUtils = async (identifier, type = "email") => {
  logger.info("Starting execution of the findExistingAdminUtils");
  try {
    const query =
      type === "email" ? { email: identifier } : { _id: identifier };
    return await Admin.findOne(query).where({ deletedAt: null, status: 1 });;
  } catch (error) {
    logger.error("Error occurred while executing the findExistingAdminUtils\n" + error);
    throw error;
  }
};

/**
 * login admin
 * @param {string} email - Email of admin.
 * @param {String} password - Password of admin.
 * @returns {Promise<void>} - Returns object
 */
export const loginAdminUtils = async (email, password) => {
  logger.info("Starting execution of the loginAdminUtils");
  try {
    let admin = await Admin.findOne({ email }).populate({
      path: "roleId",
      select: "id name access",
      populate: {
        path: "access",
        model: "Permission",
        select: "codename",
      },
    });
    if (admin && admin.comparePassword(password)) {
      if (admin.status == 1) {
        if (admin.forcePwdChangeFlag == 0 && moment().isSameOrBefore(moment(admin.pwdExpiryDate))) {
          let isAdmin = admin.roleId.name == 'admin' ? 1 : 0;
          const token = admin.generateJWT({ isAdmin });
          const { access, ...rest } = admin.roleId.toObject();
          const permissions = access;
          rest.permissions = permissions;

          const data = {
            id: admin._id,
            name: admin.firstName + " " + admin.lastName,
            email: admin.email,
            role: rest,
            isHead: admin.isHead,
            deleteAllowed: true ? admin.isHead == 1 : false,
            isAdmin
          };
          return { token, isValid: true, isAuth: true, data, isModel: false };
        } else {
          return { token: null, isModel: true, email: email };
        }
      } else {
        return { token: null, isValid: true, isAuth: false };
      }
    } else {
      return { token: null, isValid: false };
    }
  } catch (error) {
    logger.error("Error occurred while executing the loginAdminUtils\n" + error);
    throw error;
  }
};

// /**
//  * Updates the Admins password
//  * @param {Mongoose model} model - document of admin for functions.
//  * @param {String} originalPassword - Original password of admin
//  * @param {String} password -  new password of admin
//  * @returns {Promise<void>} returns boolean
//  */
// export const updatePasswordUtils = async (
//   staffId,
//   currentAdminId,
//   originalPassword,
//   password
// ) => {
//   logger.info("Starting execution of the updatePasswordUtils");
//   try {
//       const admin = await Admin.findOne({_id: staffId}).where({ deletedAt: null, status: 1 });
//       if (!admin) {
//         return false;
//       }
//       admin.password = password;
//       admin.pwdExpiryDate = moment().add(PWD_EXPIRE_TIME, PWD_EXPIRE_UNIT);
//       await admin.save();
//       return true;
//   } catch (error) {
//     logger.error("Error occurred while executing the updatePasswordUtils\n" + error);
//     throw error;
//   }
// };

/**
 * Updates the Admins password
 * @param {Mongoose model} email - email of admin to update password.
 * @param {String} originalPassword - Original password of admin
 * @param {String} password -  new password of admin
 * @returns {Promise<void>} returns boolean
 */
export const forceUpdatePass = async (
  email,
  originalPassword,
  password
) => {
  logger.info("Starting execution of the forceUpdatePass");
  try {
    const admin = await Admin.findOne({ email: email });
    if (admin.forcePwdChangeFlag == 1 || moment().isAfter(moment(admin.pwdExpiryDate))) {
      if (admin && admin.comparePassword(originalPassword)) {
        admin.password = password;
        admin.forcePwdChangeFlag = 0;
        admin.pwdExpiryDate = moment().add(PWD_EXPIRE_TIME, PWD_EXPIRE_UNIT);
        await admin.save();
        return { status: true };
      } else {
        return { status: false };
      }
    } else {
      return { status: "invalid" };
    }
  } catch (error) {
    logger.error("Error occurred while executing the forceUpdatePass\n" + error);
    throw error;
  }
};

/**
 * create new random code for password update and sends to mail
 * @param {String} email - Email of admin
 * @returns {Promise<void>} returns string
 */
export const triggerForgetPwdCodeUtils = async (email) => {
  logger.info("Starting execution of the triggerForgetPwdCodeUtils");
  try {
    const admin = await findExistingAdminUtils(email);
    if (admin) {
      const randomCode = generateRandomCode();
      await savePwdCodeUtils(admin, randomCode);
      return randomCode;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("Error occurred while executing the triggerForgetPwdCodeUtils\n" + error);
    throw error;
  }
};

/**
 * saves new code to database of respective admin
 * @param {Mongoose model} admin - document of admin for functions.
 * @param {String} codeId - random code to be saved
 * @returns {Promise<void>} returns nothing
 */
export const savePwdCodeUtils = async (admin, code) => {
  logger.info("Starting execution of the savePwdCodeUtils");
  try {
    admin.forgetPassword = {
      code: code,
      isActive: 1,
      otpExpiresAt: moment().add(2, "minutes").toDate()
    };
    await admin.save();
  } catch (error) {
    logger.error("Error occurred while executing the savePwdCodeUtils\n" + error);
    throw error;
  }
};

/**
 * Validates the code
 * @param {String} email - email of admin.
 * @param {String} code - random code got from email
 * @returns {Promise<void>} returns boolean
 * */
export const verifyCodeUtils = async (email, code) => {
  logger.info("Starting execution of the verifyCodeUtils");
  try {
    const admin = await Admin.findOne({
      email: email,
      "forgetPassword.code": code,
      "forgetPassword.isActive": 1,
      "forgetPassword.otpExpiresAt": { $gt: Date.now() }
    });
    if (!admin) {
      return false;
    }
    admin.forgetPassword = {
      code: null,
      isActive: 0,
      otpExpiresAt: null,
      isCodeVerified: 1
    };
    await admin.save();
    return true;
  } catch (error) {
    logger.error("Error occurred while executing the verifyCodeUtils\n" + error);
    throw error;
  }
};

/**
 * Resets the old password
 * @param {String} email - email of admin.
 * @param {String} newPassword -new password to be updated
 * @returns {Promise<void>} returns boolean
 * */
export const forgetPasswordUtils = async (email, newPassword) => {
  logger.info("Starting execution of the forgetPasswordUtils");
  try {
    const admin = await Admin.findOne({
      email: email,
      "forgetPassword.isCodeVerified": 1
    });

    if (!admin) {
      return false;
    }
    admin.password = newPassword;
    admin.pwdExpiryDate = moment().add(PWD_EXPIRE_TIME, PWD_EXPIRE_UNIT);
    admin.forgetPassword = {
      code: null,
      isActive: 0,
      isCodeVerified: 0,
      otpExpiresAt: null
    };
    await admin.save();
    return true;
  } catch (error) {
    logger.error("Error occurred while executing the forgetPasswordUtils\n" + error);
    throw error;
  }
};