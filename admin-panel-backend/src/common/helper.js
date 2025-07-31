import moment from "moment";
import mongoose from "mongoose";
import cryptoRandomString from 'crypto-random-string';
import crypto from "crypto";

export const generateRandomCode = () => {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return randomNumber.toString();
};

//use to create unique mkey and msalt for app users 
export const generateRandomMkey = () => {
  return "gaminggle@2024@fantasy"
};

export const generateRandomMSalt = () => {
  return "fantasy#2024#gaminggle"
};

export const extractSearch = (search) => {
  searchFields = {};

  for (const [key, value] of Object.entries(search)) {
    if (value) {
      searchFields[key] = value;
    }
  }

  return searchFields;
}

/**
 * To form search filter options
 * @param {Object} searchFields object with field,type,dataType
 * @param {Object} requestFields object actual value comming in search key
 * @returns {Object}  returns filter condition object to append as query part
 * eg. "search1": { 'field': 'categoryType', 'type': 'equal', 'dataType': 'String' }
 */
export const getSearchFilterCondition = async (
  searchFields,
  requestFields
) => {
  let searchDataFilter = [];
  for (const [key, value] of Object.entries(searchFields)) {
    let searchValue = requestFields[key];
    let searchType = value.type.trim();
    if (searchValue !== undefined && searchValue !== "") {
      switch (searchType) {
        case 'regex':
          if (value.dataType == 'Number') {
            searchDataFilter.push({
              $expr: {
                $regexMatch: {
                  input: { $toString: `$${value.field}` },
                  regex: searchValue.toString()
                }
              }
            })
          } else {
            let RegExp_Search = new RegExp(`${searchValue}`, "i");
            searchDataFilter.push({ [value.field]: { $regex: RegExp_Search } });
          }
          break;
        case 'equal':
          if (value.hasOwnProperty('dataType') && value.dataType == 'Number') {
            searchDataFilter.push({ [value.field]: Number(searchValue) });
          }
          else if (value.hasOwnProperty('dataType') && value.dataType == 'EqualORNumber') {
            let fieldValue = JSON.parse(searchValue.toLowerCase());
            const data = value.field.split("|");
            const orCondition = { $or: data.map(value => ({ [value]: fieldValue })) };
            searchDataFilter.push(orCondition);
          }
          else if (value.hasOwnProperty('dataType') && value.dataType == 'Boolean') {
            let fieldValue = JSON.parse(searchValue.toLowerCase());
            searchDataFilter.push({ [value.field]: fieldValue });
          } else if (value.hasOwnProperty('dataType') && value.dataType == 'Object') {
            const objectId = new mongoose.Types.ObjectId(`${searchValue}`);
            searchDataFilter.push({ [value.field]: objectId });
          } else if (value.hasOwnProperty('dataType') && value.dataType == 'String') {
            searchDataFilter.push({ [value.field]: searchValue });
          }
          break;
        case 'objectField':
          if (value.hasOwnProperty('dataType') && value.dataType == 'Object') {
            let filter = {};
            filter[`${value.field}.${searchValue}`] = 1;
            searchDataFilter.push(filter);
          }
          else {
            searchDataFilter.push({ [value.field]: searchValue });
          }
          break;
        case 'range': // New case for range search
          let rangeValues = searchValue.rangeFilter.split(' - ');
          if (rangeValues.length === 2) {
            let minValue = Number(rangeValues[0]);
            let maxValue = Number(rangeValues[1]);
            searchDataFilter.push({ [value.field]: { $gte: minValue, $lte: maxValue } });
          }
          break;
        case 'date':
          if (value.hasOwnProperty('dataType') && value.dataType == 'range' && value.hasOwnProperty('format')) {
            let dateRange = searchValue.split(' - ');
            let dateFormat = value.format;
            const startDate = moment(dateRange[0], 'DD/MM/YYYY').format(dateFormat);
            const endDate = moment(dateRange[1], 'DD/MM/YYYY').format(dateFormat);
            searchDataFilter.push({ [value.field]: { $gte: `${startDate} 00:00:00`, $lte: `${endDate} 23:59:59` } });
          } else if (value.hasOwnProperty('dataType') && value.dataType == 'stringRange') {
            //when collection contains date as in string format i.e  "dd-mm-yyyy"
            const [startDateStr, endDateStr] = searchValue.split(' - ');
            const startDate = moment(startDateStr, 'DD/MM/YYYY').startOf('day').utc().toDate();
            const endDate = moment(endDateStr, 'DD/MM/YYYY').endOf('day').utc().toDate();

            searchDataFilter.push({
              [value.field]: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            });
          } else if (value.hasOwnProperty('dataType') && value.dataType == 'formattedStringRange'){
            //when collection contains date as in string format i.e  "YYYY-MM-DD"
            const [startDateStr, endDateStr] = searchValue.split(' - ');
            const startDate = moment(startDateStr, 'DD/MM/YYYY').format("YYYY-MM-DD 00:00:00");
            const endDate = moment(endDateStr, 'DD/MM/YYYY').format("YYYY-MM-DD 23:59:59");
            
            searchDataFilter.push({
              [value.field]: {
                $gte: startDate,
                $lte: endDate
              }
            });  
          } else {
            // let date = moment(searchValue, 'DD/MM/YYYY').toDate();
            let dateFormat = value.format;
            let date = moment(searchValue, 'DD/MM/YYYY').utc().format(dateFormat);
            searchDataFilter.push({ [value.field]: { $eq: date } });
          }
          break;
        default:
          console.log('do nothing...');
      }
    }
  }
  return searchDataFilter;
};

/*
const inputArray = [
  {
    path: "roleId>>access>>dddd",
    select: "roleId,name>>title>>*>>cId,cNm",
  },
  {
    path: "roleId>>ccc",
    select: "roleId,name>>cId,cNm",
  },
  {
    path: "departmentId",
    select: "*",
  },
];
*/
export const convertToPopulateStage = (inputArray) => {
  const output = [];
  inputArray.forEach(item => {
    const paths = item.path.split(">>");
    const selects = item.select.split(">>");
    let current = output;
    paths.forEach((path, index) => {
      let select = selects[index].replace(/,/g, ' ');
      if (select === "*") {
        select = "";
      }
      const existingPopulate = current.find(entry => entry.path === path);
      if (!existingPopulate) {
        const newPopulate = { path, populate: [] };
        if (select !== "") {
          newPopulate.select = select;
        }
        current.push(newPopulate);
        current = newPopulate.populate;
      } else {
        current = existingPopulate.populate;
      }
    });
  });

  return output;
}

/**
 * @param {String} inputString
 * @returns {String}  formatted string with lowercase words and spaces replaced by underscores
 */
export const convertToSnakeCase = (inputString) => {
  return inputString.trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * creates new randome referral code
 * @param {String} length length of code
 * @returns {String}  returns new random ReferralCode
 */
export const generateUniqueReferralCode = (length = 6) => {
  let result = cryptoRandomString({ length: length, type: 'distinguishable' });
  return result;
};

/**
 * masks input number
 * @param {String} length length of code
 * @returns {String}  returns new masked number
 */
export const maskNumber = (number) => {
  const numberStr = String(number);

  if (numberStr.length <= 4) {
    return numberStr;
  } else {
    const maskedStr = '*'.repeat(numberStr.length - 4) + numberStr.slice(-4);
    return maskedStr;
  }
}

/**
 * generates unique batch key
 * @returns {String} return key
 */
export const generateUniqueBatchKey = () => {
  const timestamp = Date.now().toString(36);
  const randomString = crypto.randomBytes(6).toString('hex');
  const batchKey = `${timestamp}-${randomString}`;
  return batchKey;
}

export const toTitleCase = (str) => {
  return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};