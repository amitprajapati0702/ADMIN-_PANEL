import HTTP_CODE from "../../common/codeConstants.js";
import { isArray, isBase64Url, isEmail, validateIndianPhoneNumber, isPositiveNumber, isPositiveInteger, isValidReferralFriends, isString, isValidEnum, isValidUrl, newRequiredFieldsValidation, maxEmailLength } from "../../common/validation.js";
import { RESPONSE_STATUS, YES_NO_TYPE } from "../../common/enumConstants.js";
import logger from "../../common/logger.js";
import { performModelQuery, updateMultipleFields } from "../../utils/commonUtils.js";
import GeneralSettings from "../models/generalSettingsModel.js";
import { getFileUrlExist, handleImageUploadForUpdate } from "../../utils/fileUploadUtils.js";
import { getFileUrlExistOnS3 } from "../../services/fileUploadService.js";
const modelName = 'GeneralSettings';
const folderName = 'general-settings'

/**
 * Updates GeneralSettings value
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} it returns no data.
 */
export const updateGeneralSettings = async (req, res) => {
    const session = await GeneralSettings.startSession();
    session.startTransaction();
    try {
        logger.info("Starting execution of the updateGeneralSettings");
        const adminId = req.admin.id;

        let generalSettingData = [];
        if (Object.keys(req.body).length == 0) {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "KEY_VAlUE_REQUIRED");
        }
        const check = await checkValueFields(req.body, res)
        if (check.key == 'invalidKey') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: 'Key' });
        }
        if (check.key == 'invalid') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "INVALID_FIELD", [], { field1: 'Value' });
        }
        if (check.key == 'notAllowed') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALLOW_FIELD");
        }
        if (check.key == 'missingKeys' && check.missingFields) {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "ALL_VALUES_REQUIRED", null, { fields: check.missingFields });
        }
        if (check.key == 'emptyArray') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "EMPTY_ARRAY", [], { field1: 'Referral friends array' });
        }
        if (check.key == 'arrayLengthLimitExceeded') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "LENGTH_LIMIT_EXCEEDED", [], { field1: 'Referral friends array', length: '10' });
        }
        if (check.key == 'minPercentageExceeded') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "MIN_PERCENTAGE_LIMIT_EXCEEDED");
        }
        if (check.key == 'maxPercentageExceeded') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "PERCENTAGE_LIMIT_EXCEEDED");
        }
        if (check.key == 'invalid_length') {
            return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.OK, "LENGTH_LIMIT_EXCEEDED", [], { field1: 'Email', length: '100' });
        }
        


        dataToUpdate(generalSettingData, req.body, adminId);
        const result = await updateMultipleFields(modelName, generalSettingData);
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
        logger.error("Error occurred while executing the updateGeneralSettings " + error);
        await session.abortTransaction();
        session.endSession();
        return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
    }
};

/**
 * Retrieves General settings details by Type
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} returns object
 */

export const getGeneralSettings = async (req, res) => {
    try {
        logger.info("Starting execution of the getGeneralSettings");
        const { type = [] } = req.body;
        const operation = 'readAll';
        let query = {};
        if (type.length > 0) {
            query.key = { $in: type };
        }
        const selectFields = { key: 1, value: 1 };
        const data = { query, selectFields };
        const { result, totalCount } = await performModelQuery(modelName, operation, data);
        let modifiedResult = [];
        if (isContainImageField(type) || type.length === 0) {
            modifiedResult = await Promise.all(result.map(async (item) => {
                // if (isValidUrl(item.value) && item.value.split("amazonaws.com/").length > 1) {
                //     let imageObj = { image : item.value };
                //     let imageLink = await getFileUrlExist(imageObj, "image");
                //     return { [item.key] : imageLink}
                //     /*
                //     const imageKey = item.value;
                //     const currentKey = imageKey.split("amazonaws.com/");
                //     let awsImageKey = "";
                //     if (currentKey.length > 1) {
                //         awsImageKey = currentKey[1];
                //         const exists = await getFileUrlExistOnS3(awsImageKey);
                //         if (!exists) {
                //             return {
                //                 [item.key]: ''
                //             };
                //         } else {
                //             return {
                //                 [item.key]: item.value
                //             };
                //         }
                //     } else {
                //         return {
                //             [item.key]: ''
                //         };
                //     }
                //     */

                // } else {
                //     return { [item.key]: item.value };
                // }
                switch (item.key) {
                    case "frontBgImage":
                    case "dfsBannerImage":
                    case "prizeBannerImage":
                    case "prizeBannerImage":
                        return { [item.key]: `${process.env.S3_URL}${item.value}` }
                    default:
                        return { [item.key]: item.value };
                }
            }));
        }
        else {
            modifiedResult = await Promise.all(result.map(async (item) => {
                return { [item.key]: item.value };
            }))
        }

        const formattedResult = modifiedResult.reduce((acc, obj) => {
            const key = Object.keys(obj)[0];
            acc[key] = obj[key];
            return acc;
        }, {});
        if (totalCount > 0) {
            return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "DATA_FETCHED", { result: formattedResult, totalCount: totalCount });
        } else {
            return res.sendResponse(RESPONSE_STATUS.SUCCESS, HTTP_CODE.OK, "NO_DATA", { result, totalCount: totalCount });
        }
    } catch (error) {
        logger.error("Error occurred while executing the getGeneralSettings" + error);
        return res.sendResponse(RESPONSE_STATUS.ERROR, HTTP_CODE.SERVER_ERROR, "SOMETHING_WENT_WRONG");
    }
};

/**
 * hepler function to create a array format to update GeneralSettings.
 * @param {Array} generalSettingData - The array on which format will be created.
 * @param {Object} data - The data which needs to be updated.
 * @param {string} adminId - The ID of the admin performing the update.
 * @returns {Promise<void>} returns nothing
 */
const dataToUpdate = (generalSettingData, data, adminId) => {
    logger.info("Starting execution of the dataToUpdate");
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            generalSettingData.push({
                filter: { key },
                update: { value: data[key], updatedBy: adminId },
            });
        }
    }
}

/**
 * Validates and processes the fields of the provided data object according to specific criteria.
 * @param {Object} data - The object containing data to be checked.
 * @param {Object} res - The response object used for handling responses.
 * @returns {Promise<boolean|{ key: string }>} A Promise that resolves to a boolean indicating whether the validation was successful or an object with a 'key' property indicating an error occurred.
 */
const checkValueFields = async (data, res) => {
    logger.info("Starting execution of the checkValueFields");
    try {
        for (let key in data) {
            const value = data[key];
            switch (key) {
                case 'claimBonusMultiplier':
                case 'dealPromosMultiplier':
                case 'directDepositeMultiplier':
                case 'referralsMultiplier':
                case 'maxWithdrawalAmt':
                case 'minWithdrawalAmt':
                case 'maxDepositeAmt':
                case 'minDepositeAmt':
                case 'activateSpinOn':
                    if (!isPositiveNumber(value)) {
                        return { key: 'invalid' };
                    }
                    break;

                case 'addressInfo':
                    if (!isString(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'systemcontactNo':
                    if (!validateIndianPhoneNumber(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'systemEmail':
                    if (!isEmail(value)) {
                        return { key: 'invalid' };
                    }
                    if(maxEmailLength(value)){
                        return { key: 'invalid_length' };
                    }
                    break;
                case 'prizeDistributionCron':
                case 'allowJoinEmail':
                case 'allowPrize':
                case 'allowDfs':
                    if (!isValidEnum(YES_NO_TYPE, value)) {
                        return { key: 'invalid' };
                    }
                    break;

                case 'frontBgImage':
                    if (!isBase64Url(value)) {
                        return { key: 'invalid' };
                    } else {
                        const condition = { query: { key: key } };
                        await handleImageUploadForUpdate(condition, modelName, value, "value", data, false, folderName, res, 'frontBgImage');
                    }
                    break;

                case 'dfsBannerImage':
                    if (!isBase64Url(value)) {
                        return { key: 'invalid' };
                    } else {
                        if (data.allowDfs && data.allowDfs === 1) {
                            const condition = { query: { key: key } };
                            await handleImageUploadForUpdate(condition, modelName, value, "value", data, false, folderName, res, 'dfsBannerImage');
                        }
                        else {
                            return { key: 'notAllowed' };
                        }
                    }
                    break;
                case 'prizeBannerImage':
                    if (!isBase64Url(value)) {
                        return { key: 'invalid' };
                    } else {
                        if (data.allowPrize && data.allowPrize === 1) {
                            const condition = { query: { key: key } };
                            await handleImageUploadForUpdate(condition, modelName, value, "value", data, false, folderName, res, 'prizeBannerImage');
                        }
                        else {
                            return { key: 'notAllowed' };
                        }
                    }
                    break;
                case 'feeds':
                    const requiredFields1 = ['text1', 'text2', 'text3', 'text4', 'text5'];
                    const missingFields1 = newRequiredFieldsValidation(requiredFields1, value);
                    if (missingFields1.length > 0) {
                        return { key: 'missingKeys', missingFields: missingFields1 };
                    }
                    break;
                case 'walletHeader':
                case 'walletBody':
                    const requiredFields2 = ['hi', 'en'];
                    const missingFields2 = newRequiredFieldsValidation(requiredFields2, value);
                    if (missingFields2.length > 0) {
                        return { key: 'missingKeys', missingFields: missingFields2 };
                    }
                    break;
                case 'androidVersion':
                case 'iosVersion':
                    if (!isArray(value) || value.length <= 0) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'androidAppLink':
                case 'iosAppLink':
                case 'youtubeLink':
                case 'twitterLink':
                case 'fbLink':
                    if (!isValidUrl(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'referredFrom':
                    if (!isPositiveInteger(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'referredTo':
                case 'signBonus':
                case 'signBonusMultiplier':
                    if (!isPositiveInteger(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'referralUptoAmount':
                    if (!isPositiveInteger(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'referralPercentage' :
                    if(value < 0) return { key: 'minPercentageExceeded' };
                    if (value > 100){
                        return { key: 'maxPercentageExceeded' };
                    }
                    // if (!isPositiveInteger(value) || value > 100 || value < 0) {
                    if (!isPositiveInteger(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                
                case 'referralFriends':
                    if (value.length == 0) return { key: 'emptyArray' };
                    if (value.length > 10) return { key: 'arrayLengthLimitExceeded' };

                    if (!isValidReferralFriends(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                case 'phoneNumber':
                    if (!validateIndianPhoneNumber(value)) {
                        return { key: 'invalid' };
                    }
                    break;
                
        
                default:
                    return { key: 'invalidKey' };
            }
        }
        return true;
    }
    catch (error) {
        logger.error("Error occurred while executing the checkValueFields" + error);
        throw new Error('Something went wrong!');
    }
}

/**
 * Checks if the provided string contains any of the specified strings.
 * @param {string} type - The string to be checked.
 * @returns {boolean} - Returns true if the provided string contains any of the specified strings, otherwise false.
 */
export const isContainImageField = (type) => {
    const strings = ['frontBgImage', 'prizeBannerImage', 'dfsBannerImage'];
    return strings.some(str => type.includes(str));
}