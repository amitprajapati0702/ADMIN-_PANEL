import mongoose from "mongoose";
import fs from "fs";
import path from "path";
export const isArray = (value) => Array.isArray(value);

export const requiredFieldsValidation = (requiredFields, body) => {
  return requiredFields.every((field) => field in body);
};
export const newRequiredFieldsValidation = (requiredFields, body) => {
  return requiredFields.filter((field) => {
    if (!(field in body) || body[field] === null) return true;
    let bodyField = body[field].toString();
    return bodyField.trim() === '';
  });
};



export const isArrayOfObjectKeysExist = (inputKey, enumKeys) => {
  return inputKey.filter((key) => !enumKeys.includes(key));
};

export const isObjectHasSpecificKeys = (inputObj, objKeys) => {
  for (let key of objKeys) {
    if (!inputObj.hasOwnProperty(key) || !inputObj[key]) {
      return false;
    }
  }
  return true;
}

export const isArrayOfObjectHasSpecificKeys = (array, keys) => {
  for (let obj of array) {
    for (let key of keys) {
      if (!obj.hasOwnProperty(key)) {
        return false;
      }
    }
  }
  return true;
}

export const getInvalidKeys = (inputObj, objKeys) => {
  console.log({ inputObj, objKeys })
  const invalidKeys = [];
  for (let key of Object.keys(inputObj)) {
    console.log(key)
    if (!objKeys.includes(key)) {
      invalidKeys.push(key);
    }
  }
  return invalidKeys;
}

export const isObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isString = (value) => typeof value === "string";

export const isNumber = (value) => typeof value === "number" && !isNaN(value);

export const isNonNegative = (value) => typeof value === "number" && !isNaN(value) && value >= 0;

export const isNum0to99 = (value) => typeof value === "number" && !isNaN(value) && value >= 0 && value <= 99;

export const isDecimalNumber = (value) => typeof value === "number" && !isNaN(value) && value >= 0 && value <= 99.99;

export const isPercentage = (value) => typeof value === "number" && !isNaN(value) && value >= 0 && value <= 100;

export const isPositiveNumber = (value) =>
  typeof value === "number" && !isNaN(value) && value > 0;

export const isBoolean = (value) => typeof value === "boolean";

export const isNull = (value) => value === null;

export const isUndefined = (value) => typeof value === "undefined";

export const isDate = (value) => value instanceof Date;

export const isFunction = (value) => typeof value === "function";

export const isPositiveInteger = (value) => {
  return Number.isInteger(value) && value > 0;
}

const isValidReferralEntries = (entry) => {
  return entry && typeof entry === 'object' && isPositiveInteger(entry.count) && isPositiveInteger(entry.amount);
}

// it should be array of object having count and amount fields and max 10 entries
export const isValidReferralFriends = (value) => {
  if (!isArray(value)) {
    return false;
  }
  return value.every(isValidReferralEntries);
}

export const isObjectKeyExist = (obj) =>
  Object.keys(obj).length > 0 ? true : false;

export const isPassword = (value) => {
  // Password must be at least 8 characters long
  if (value.length < 8) {
    return false;
  }

  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(value)) {
    return false;
  }

  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(value)) {
    return false;
  }

  // Password must contain at least one digit
  if (!/\d/.test(value)) {
    return false;
  }

  // Password can contain special characters, this checks for at least one
  if (!/[$@$!%*?&]/.test(value)) {
    return false;
  }

  // All criteria met, password is valid
  return true;
};

export const isLanguageObjectExist = (obj) =>
  Object.keys(obj).length > 0 &&
    "en" in obj &&
    "hi" in obj &&
    obj["en"] != "" &&
    obj["hi"] != ""
    ? true
    : false;

export const isMongoObjectId = (value) => {
  try {
    if (Array.isArray(value)) {
      return value.every((id) => {
        return (
          typeof mongoose !== "undefined" &&
          mongoose.Types.ObjectId.isValid(id)
        );
      });
    } else {
      return (
        typeof mongoose !== "undefined" &&
        mongoose.Types.ObjectId.isValid(value)
      );
    }
  } catch (error) {
    return false;
  }
};

export const isValidJSON = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidUrl = (urlString) => {
  const url =
    /^(?:https?|http):\/\/(?:\S+(?::\S*)?@)?(?:(?!-)[A-Za-z0-9-]{1,63}(?:\.(?!-)[A-Za-z0-9-]{1,63})+|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]{1,63})\])(?::\d{2,5})?(?:\/[^\s]*)?$/;
  return url.test(urlString);
};

export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const maxEmailLength = (value) => value.length > 100 ? true : false;

export const isPhoneNumber = (value) => {
  return (
    /^[0-9]{1,3}(?:[\s_\-]?[0-9]){9}$/.test(value) &&
    value.replace(/[\s_\-]/g, "").length === 10
  );
};

export const isFileWithAllowedExtension = (filename, allowedExtensions) => {
  const ext = path.extname(filename).toLowerCase();

  return allowedExtensions.includes(ext.slice(1));
};
export const isFile = (file) => {
  try {
    if (typeof file === "string") {
      const stats = fs.statSync(file);
      return stats.isFile();
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
export const compareDates = (firstDate, secondDate) => {
  const firstYear = firstDate.getFullYear();
  const firstMonth = firstDate.getMonth();
  const firstDay = firstDate.getDate();
  const secondYear = secondDate.getFullYear();
  const secondMonth = secondDate.getMonth();
  const secondDay = secondDate.getDate();

  return (
    firstYear > secondYear ||
    (firstYear === secondYear && firstMonth > secondMonth) ||
    (firstYear === secondYear &&
      firstMonth === secondMonth &&
      firstDay >= secondDay)
  );
};
export function validateAdhar(aadharNumber) {
  //Verhoeff algorithm
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  let c = 0;

  let invertedArray = aadharNumber
    .replace(/\s/g, "")
    .replace(/-/g, "")
    .split("")
    .map(Number)
    .reverse();

  invertedArray.forEach((val, i) => {
    c = d[c][p[i % 8][val]];
  });

  return c === 0;
}

export function validatePan(pan) {
  const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return regex.test(pan);
}

export function isElementInArray(element, array) {
  return array.includes(element);
}
export function isElementInObject(element, object) {
  return object.hasOwnProperty(element);
}

export function isElementPresentInNestedObject(obj, targetElement) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === targetElement) {
        return true;
      } else if (
        typeof obj[key] === "object" &&
        isElementPresent(obj[key], targetElement)
      ) {
        return true;
      }
    }
  }
  return false;
}
export function isValidIp(IP) {
  let ipv4 =
    /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/;

  let ipv6 = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;

  if (IP.match(ipv4)) return true;
  else if (IP.match(ipv6)) return true;

  return false;
}
export const isValidUuid = (value) => {
  const uuidRegex =
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-5][a-fA-F0-9]{3}-[89ABab][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
  return uuidRegex.test(value);
};

export const isValidEnum = (object, input) => {
  return Object.values(object).includes(input)
}

export const isBase64Url = (str) => {
  const data = str.toString();
  const regex = /^data:(image\/\w+);base64,/;
  return data.match(regex);
}

export const isValidGSTCode = async (code) => {
  let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
  if (regTest.test(code)) {
    return true;
  } else {
    return false;
  }
};

export const validateIndianPhoneNumber = (phoneNumber) => {
  const regex = /^[1-9][0-9]{9}$/;
  return regex?.test(phoneNumber);
}

export const isValidAmountInEveryObjects = (data, fieldName) => {
  return  data.every(item => item[fieldName] > 0);
}