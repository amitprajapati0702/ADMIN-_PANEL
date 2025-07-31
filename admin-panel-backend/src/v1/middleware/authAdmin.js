import jwt from "jsonwebtoken";
import { findExistingAdminUtils } from "../../utils/adminUtils.js";
import HTTP_CODE from "../../common/codeConstants.js";
import { RESPONSE_STATUS } from "../../common/enumConstants.js";
import logger from "../../common/logger.js";
import Role from "../models/roleModel.js";
/**
 * Middleware to basic authentication using username and password
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const authenticateBasicAuth = (req, res, next) => {
  try {
    logger.info('Starting execution of the authenticateBasicAuth');
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.OK, "AUTH_FAILED");
    }
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [username, password] = decodedCredentials.split(':');
    if (username == process.env.BASIC_AUTH_USERNAME && password == process.env.BASIC_AUTH_PASSWORD) {
      next();
    } else {
      return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.OK, "AUTH_FAILED");
    }
  } catch (error) {
    logger.error('Error occurred while executing the authenticateBasicAuth\n' + error);
    res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Middleware to authenticate admin using JWT token
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const authenticateToken = (req, res, next) => {
  try {
    logger.info('Starting execution of the authenticateToken');
    const token = req.header('accessToken') || req.header('AccessToken')
    if (!token) {
      return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.OK, "AUTH_TOKEN_REQUIRED");
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, admin) => {
      if (err) {
        return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.OK, "INVALID_AUTH_TOKEN");
      }
      const adminResult = await findExistingAdminUtils(admin.id, "objectId");
      if (!adminResult) {
        return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.FORBIDDEN, "INVALID_AUTH_TOKEN");
      }
      req.admin = adminResult;
      return next();
    });
  } catch (error) {
    logger.error('Error occurred while executing the authenticateToken\n' + error);
    res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
  }
};

/**
 * Middleware to check permissions based on route and permission key
 * @param {string} permissionKey - The permission key to check for.
 */
export const checkPermissionMiddleware = (permissionKey) => {
  return async (req, res, next) => {
    try {
      logger.info(`Checking permission for ${permissionKey}`);
      const token = req.header('accessToken')
      jwt.verify(token, process.env.JWT_SECRET, async (err, admin) => {
        if (admin.isAdmin == 1) {
          return next();
        }
        //added by sagar as we are getting header size limit error - START
        let rolePermissonData = await Role.findOne({ _id: admin.roleId}).select('name').populate({
          path: "access",
          model: "Permission",
          select: "codename",
        })
        //added by sagar as we are getting header size limit error - END
        const hasPermission = rolePermissonData.access.some(p => p.codename === permissionKey);
        if (hasPermission) {
          return next();
        } else {
          return res.sendResponse(RESPONSE_STATUS.AUTH_FAIL, HTTP_CODE.OK, "ACCESS_DENIED");
        }
      });
    } catch (error) {
      logger.error(`Error occurred while checking permission for ${permissionKey}\n${error}`);
      res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
    }
  };
};