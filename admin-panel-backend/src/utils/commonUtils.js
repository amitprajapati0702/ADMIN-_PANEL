import mongoose from "mongoose";
import logger from "../common/logger.js";
import { isObjectKeyExist, isUndefined } from "../common/validation.js";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();
const ENABLE_QUERY = process.env.QUERY_LOGGER;
import UserModel from "../v1/models/userModel.js";


/**
 * Common Query handler for CRUD operation
 * @param {Mongoose model} modelName -  Name of models for functions.
 * @param {String} operation -  Operations to perform
 * @param {String} data -  data to pass
 * @returns {Promise<void>} returns array or object depending on operations
 */

export const performModelQuery = async (modelName, operation, data) => {
  try {
    logger.info('Starting execution of the performModelQuery');
    const Model = mongoose.model(modelName);
    const populateNested = (queryBuilder, populateOptions) => {
      populateOptions.forEach(populateOption => {
        const { path, select, populate } = populateOption;
        let populateConfig = { path, select };

        if (populate) {
          populateConfig.populate = populate.map(populateItem => ({
            path: populateItem.path,
            select: populateItem.select
          }));
        }
        queryBuilder = queryBuilder.populate(populateConfig);
      });
      return queryBuilder;
    };

    const operations = {
      create: async () => await Model.create(data),
      read: async () => {
        const { page = 1, limit = 10, selectFields = {}, populate = [], sortBy = [], query } = data;
        // console.log({ page, limit, selectFields, populate, sortBy, query });
        const offset = (page - 1) * limit;
        let queryBuilder = Model.find(query).skip(offset).limit(limit).where({ deletedAt: null });

        if (selectFields && Object.keys(selectFields).length > 0) {
          queryBuilder = queryBuilder.select(selectFields);
        }

        if (populate && populate.length > 0) {
          queryBuilder = populateNested(queryBuilder, populate);
        }

        if (sortBy && sortBy.length > 0) {
          queryBuilder = queryBuilder.sort(sortBy.map(sort => sort.split(':')));
        }
        const [documents, totalCount, remainingCount] = await Promise.all([
          queryBuilder.exec(),
          Model.countDocuments(query).where({ deletedAt: null }),
          Model.countDocuments(query).skip(offset + limit).where({ deletedAt: null })
        ]);
        const hasEntries = documents.length > 0 ? true : false;
        return {
          result: documents,
          totalPages: hasEntries ? (Math.ceil(totalCount / limit)) : 0,
          currentPage: page,
          totalCount: hasEntries ? totalCount : 0,
          remainingCount
        };
      },
      readAll: async () => {
        const { selectFields = {}, populate = [], sortBy = [], query } = data;
        let queryBuilder = Model.find(query).where({ deletedAt: null })

        if (Object.keys(selectFields).length > 0) {
          queryBuilder = queryBuilder.select(selectFields);
        }

        if (populate && populate.length > 0) {
          queryBuilder = populateNested(queryBuilder, populate);
        }

        if (sortBy && sortBy.length > 0) {
          queryBuilder = queryBuilder.sort(sortBy.map(sort => sort.split(':')));
        }
        const documents = await queryBuilder.exec();
        const totalCount = await Model.countDocuments(query).where({ deletedAt: null });
        return {
          result: documents,
          totalCount,
        };
      },
      update: async () => await Model.updateOne(data.query, data.update).where({ deletedAt: null }),
      delete: async () => await Model.deleteOne(data).where({ deletedAt: null }),
      updateStatus: async () => await Model.updateOne({ _id: data.query.id }, { $set: { status: data.update.status, updatedBy: data.update.updatedBy } }).where({ deletedAt: null }),
      find: async () => await Model.find().where({ deletedAt: null }),
      findOne: async () => await Model.findOne(data.query, data?.selectFields).where({ deletedAt: null }),
      findById: async () => await Model.findById(data.id).where({ deletedAt: null }).select({ __v: 0 }),
      insertMany: async () => await Model.insertMany(data),
    };

    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query, projectionData) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) > Projection Part: ${JSON.stringify(projectionData)}`);
      });
    }
    if (!operations[operation]) {
      throw new Error('Operation not supported');
    }
    return await operations[operation]();
  } catch (error) {
    logger.error('Error while execution of the performModelQuery \n', error);
  }
}

/**
 * For User whose account is deleted 
 * @param {Mongoose model} modelName -  Name of models for functions.
 * @param {String} operation -  Operations to perform
 * @param {String} data -  data to pass
 * @returns {Promise<void>} returns array or object depending on operations
 */

export const performModelQueryForDeletedUser = async (modelName, operation, data) => {
  try {
    logger.info('Starting execution of the performModelQueryForDeletedUser');
    const Model = mongoose.model(modelName);
    const populateNested = (queryBuilder, populateOptions) => {
      populateOptions.forEach(populateOption => {
        const { path, select, populate } = populateOption;
        let populateConfig = { path, select };

        if (populate) {
          populateConfig.populate = populate.map(populateItem => ({
            path: populateItem.path,
            select: populateItem.select
          }));
        }
        queryBuilder = queryBuilder.populate(populateConfig);
      });
      return queryBuilder;
    };

    const operations = {
      read: async () => {
        const { page = 1, limit = 10, selectFields = {}, populate = [], sortBy = [], query } = data;
        // console.log({ page, limit, selectFields, populate, sortBy, query });
        const offset = (page - 1) * limit;
        let queryBuilder = Model.find(query).skip(offset).limit(limit);

        if (selectFields && Object.keys(selectFields).length > 0) {
          queryBuilder = queryBuilder.select(selectFields);
        }

        if (populate && populate.length > 0) {
          queryBuilder = populateNested(queryBuilder, populate);
        }

        if (sortBy && sortBy.length > 0) {
          queryBuilder = queryBuilder.sort(sortBy.map(sort => sort.split(':')));
        }
        const [documents, totalCount, remainingCount] = await Promise.all([
          queryBuilder.exec(),
          Model.countDocuments(query),
          Model.countDocuments(query).skip(offset + limit)
        ]);
        const hasEntries = documents.length > 0 ? true : false;
        return {
          result: documents,
          totalPages: hasEntries ? (Math.ceil(totalCount / limit)) : 0,
          currentPage: page,
          totalCount: hasEntries ? totalCount : 0,
          remainingCount
        };
      },
      readAll: async () => {
        const { selectFields = {}, populate = [], sortBy = [], query } = data;
        let queryBuilder = Model.find(query);

        if (Object.keys(selectFields).length > 0) {
          queryBuilder = queryBuilder.select(selectFields);
        }

        if (populate && populate.length > 0) {
          queryBuilder = populateNested(queryBuilder, populate);
        }

        if (sortBy && sortBy.length > 0) {
          queryBuilder = queryBuilder.sort(sortBy.map(sort => sort.split(':')));
        }
        const documents = await queryBuilder.exec();
        const totalCount = await Model.countDocuments(query);
        return {
          result: documents,
          totalCount,
        };
      }
    };

    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query, projectionData) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) > Projection Part: ${JSON.stringify(projectionData)}`);
      });
    }
    if (!operations[operation]) {
      throw new Error('Operation not supported');
    }
    return await operations[operation]();
  } catch (error) {
    logger.error('Error while execution of the performModelQueryForDeletedUser \n', error);
  }
}

/**
 * Common function to check field value is exist or not
 * @param {String} modelName - The name of the mongoose model   
 * @param {ObjectId} id - Id Key for checking in database
 * @param {ObjectId} adminnId - to set the updatedBy field.
 * @returns {Object} returns object.
 */

export const softDeleteDocument = async (modelName, id, adminId) => {
  try {
    logger.info('Starting execution of the softDeleteDocument');
    const Model = mongoose.model(modelName);
    const result = await Model.updateOne({ _id: id }, { $set: { deletedAt: new Date(), status: 0, updatedBy: adminId } }).where({ deletedAt: null });
    return result;
  } catch (error) {
    logger.error('Starting execution of the softDeleteDocument \n', error);
    throw new Error(error)
  }
};

/**
 * Common function to check field value is exist or not
 * @param {String} modelName - The name of the mongoose model   
 * @param {String} field - Key for checking in database
 * @param {Any} value - Value to be checked against the key  
 * @param {String} id - _id of document which we want to match with given value.
 * @param {Object} extraCondition - Extra condition for filter record from database.
 * @returns {Promise<void>} returns boolean;
 */

export const checKFieldValueExist = async (modelName, field, value, id, extraCondition = {}) => {
  try {
    logger.info("Starting execution of the checKFieldValueExist");
    const Model = mongoose.model(modelName);
    if (field == 'id') {
      field = '_id';
    }
    let filter = {
      [field]: (typeof (value) === "string") ? value.trim() : value
    };
    if (isObjectKeyExist(extraCondition)) {
      Object.assign(filter, extraCondition);
    }
    if (!isUndefined(id)) {
      filter._id = { $ne: id };
    }
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query, projectionData) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) > Projection Part: ${JSON.stringify(projectionData)} `);
      });
    }
    const count = await Model.countDocuments(filter).where({ deletedAt: null }).collation({ locale: 'en', strength: 2 });

    return count > 0 ? true : false;
  } catch (err) {
    logger.error('Error during execution of the checKFieldValueExist \n', err);
    throw err;
  }
};

/**
 * Common function to check field value is exist or not
 * @param {String} modelName - The name of the mongoose model   
 * @param {String} field - Key for checking in database
 * @param {Any} value - Value to be checked against the key  
 * @param {String} id - _id of document which we want to match with given value.
 * @param {Object} extraCondition - Extra condition for filter record from database.
 * @returns {Promise<void>} returns boolean;
 */

export const checKFieldValueExistForDeletedUser = async (modelName, field, value, id, extraCondition = {}) => {
  try {
    logger.info("Starting execution of the checKFieldValueExistForDeletedUser");
    const Model = mongoose.model(modelName);
    if (field == 'id') {
      field = '_id';
    }
    let filter = {
      [field]: (typeof (value) === "string") ? value.trim() : value
    };
    if (isObjectKeyExist(extraCondition)) {
      Object.assign(filter, extraCondition);
    }
    if (!isUndefined(id)) {
      filter._id = { $ne: id };
    }
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query, projectionData) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) > Projection Part: ${JSON.stringify(projectionData)} `);
      });
    }
    const count = await Model.countDocuments(filter).collation({ locale: 'en', strength: 2 });

    return count > 0 ? true : false;
  } catch (err) {
    logger.error('Error during execution of the checKFieldValueExistForDeletedUser \n', err);
    throw err;
  }
};

/**
 * Common function to check field value is exist or not
 * @param {Array} projectArray - Array contains all fields that need to populate.
 * @returns {Object}  Returns populated object with selected fields and value as 1
 */
export const projectionObject = (projectArray) => {
  let projectFieldsdata = projectArray.reduce(
    (elem, value) => ({
      ...elem,
      [value]: 1,
    }),
    {}
  );
  return projectFieldsdata;
};

/**
 * Perform an aggregation query on the specified main model using MongoDB aggregation pipeline.
 * @param {string} mainModelName - The name of the main model to perform the aggregation on.
 * @param {Array<Object>} lookupConfigs - An array of lookup configurations for $lookup stage.
 * @param {Object} projectionFields - The projection fields for $project stage.
 * @param {Object} sortConfig - The sort configuration for $sort stage.
 * @param {Object} matchCondition - The match condition for $match stage.
 * @param {number} pageSize - The number of documents per page for pagination.
 * @param {number} pageNumber - The page number to retrieve or '*' for no pagination.
 * @param {Array<number>} unwindLookupIndices - An array of indices to unwind the lookup stages.
 * @returns {Promise<Object>} An object containing the result of the aggregation query and pagination information.
 */

export const performAggregationQuery = async (mainModelName, lookupConfigs, projectionFields, sortConfig, matchCondition, pageSize, pageNumber, unwindLookupIndices) => {
  try {
    logger.info('Starting execution of the performAggregationQuery');
    const pipeline = [];
    const Model = mongoose.model(mainModelName);

    // Generate lookup stages
    lookupConfigs.forEach((config, index) => {
      pipeline.push({
        $lookup: config
      });
      if (unwindLookupIndices && unwindLookupIndices.includes(index)) {
        pipeline.push({ $unwind: `$${config.as}` });
      }
    });

    if (matchCondition) {
      matchCondition.deletedAt = null;
      pipeline.push({
        $match: matchCondition
      });
    } else {
      pipeline.push({
        $match: { deletedAt: null }
      });
    }

    // Add project stage
    pipeline.push({
      $project: projectionFields
    });

    // Add sort stage
    pipeline.push({
      $sort: sortConfig
    });
    // Execute aggregation to get total count
    const totalCountPipeline = [...pipeline];
    const totalCountStage = { $group: { _id: null, count: { $sum: 1 } } };
    totalCountPipeline.push(totalCountStage);
    const totalCountResult = await Model.aggregate(totalCountPipeline).exec();
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].count : 0;

    let pagination = {
      totalCount
    }
    if (pageNumber != '*') {
      // Calculate pagination information
      const totalPages = Math.ceil(totalCount / pageSize);
      const skip = (pageNumber - 1) * pageSize;
      const remainingCount = totalCount - (skip + pageSize) >= 0 ? totalCount - (skip + pageSize) : 0;
      // Add pagination stages
      pipeline.push({
        $skip: skip
      });
      pipeline.push({
        $limit: pageSize
      });
      Object.assign(pagination, { totalPages, currentPage: pageNumber, remainingCount, totalCount });
    }
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) `);
      });
    }
    // Execute aggregation on the main model
    const result = await Model.aggregate(pipeline).exec();
    const hasEntries = result.length > 0 ? true : false;
    const paginationOverideFields = (!hasEntries && pageNumber != '*') ? { totalPages: 0, totalCount: 0 } : {};
    return {
      result,
      ...pagination,
      ...paginationOverideFields
    };

  } catch (error) {
    logger.error('Error during execution of the performAggregationQuery \n', error);
  }
};

/**
 * Perform an aggregation query on the specified main model using MongoDB aggregation pipeline with deleted entries included.
 * @param {string} mainModelName - The name of the main model to perform the aggregation on.
 * @param {Array<Object>} lookupConfigs - An array of lookup configurations for $lookup stage.
 * @param {Object} projectionFields - The projection fields for $project stage.
 * @param {Object} sortConfig - The sort configuration for $sort stage.
 * @param {Object} matchCondition - The match condition for $match stage.
 * @param {number} pageSize - The number of documents per page for pagination.
 * @param {number} pageNumber - The page number to retrieve or '*' for no pagination.
 * @param {Array<number>} unwindLookupIndices - An array of indices to unwind the lookup stages.
 * @returns {Promise<Object>} An object containing the result of the aggregation query and pagination information.
 */

export const performAggregationQueryWithDeletedEntries = async (mainModelName, lookupConfigs, projectionFields, sortConfig, matchCondition, pageSize, pageNumber, unwindLookupIndices) => {
  try {
    logger.info('Starting execution of the performAggregationQueryWithDeletedEntries');
    const pipeline = [];
    const Model = mongoose.model(mainModelName);

    // Generate lookup stages
    lookupConfigs.forEach((config, index) => {
      pipeline.push({
        $lookup: config
      });
      if (unwindLookupIndices && unwindLookupIndices.includes(index)) {
        pipeline.push({ $unwind: `$${config.as}` });
      }
    });

    if (matchCondition) {
      pipeline.push({
        $match: matchCondition
      });
    }

    // Add project stage
    pipeline.push({
      $project: projectionFields
    });

    // Add sort stage
    pipeline.push({
      $sort: sortConfig
    });
    // Execute aggregation to get total count
    const totalCountPipeline = [...pipeline];
    const totalCountStage = { $group: { _id: null, count: { $sum: 1 } } };
    totalCountPipeline.push(totalCountStage);
    const totalCountResult = await Model.aggregate(totalCountPipeline).exec();
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].count : 0;

    let pagination = {
      totalCount
    }
    if (pageNumber != '*') {
      // Calculate pagination information
      const totalPages = Math.ceil(totalCount / pageSize);
      const skip = (pageNumber - 1) * pageSize;
      const remainingCount = totalCount - (skip + pageSize) >= 0 ? totalCount - (skip + pageSize) : 0;
      // Add pagination stages
      pipeline.push({
        $skip: skip
      });
      pipeline.push({
        $limit: pageSize
      });
      Object.assign(pagination, { totalPages, currentPage: pageNumber, remainingCount, totalCount });
    }
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) `);
      });
    }
    // Execute aggregation on the main model
    const result = await Model.aggregate(pipeline).exec();
    const hasEntries = result.length > 0 ? true : false;
    const paginationOverideFields = (!hasEntries && pageNumber != '*') ? { totalPages: 0, totalCount: 0 } : {};
    return {
      result,
      ...pagination,
      ...paginationOverideFields
    };

  } catch (error) {
    logger.error('Error during execution of the performAggregationQueryWithDeletedEntries \n', error);
  }
};

/**
 * updates multiple fields with diffrents keys in one query
 * @param {string} ModelName - The name of the model to perform the updates on.
 * @param {Array<Object>} data - Data which will be updated.
 * @returns {Promise<Object>} An object containing result of bulk updates.
 */
export const updateMultipleFields = async (modelName, data) => {
  try {
    logger.info('Starting execution of the updateMultipleFields');
    const Model = mongoose.model(modelName);
    const bulkOperations = data.map(({ filter, update }) => ({
      updateOne: {
        filter,
        update,
      },
    }));
    const result = await Model.bulkWrite(bulkOperations);
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) `);
      });
    }
    return result;
  } catch (error) {
    logger.error('Error during execution of the updateMultipleFields \n', error);
    throw error;
  }
};

/**
 * Function to fetch data from database based on specified fields and query
 * @param {String} modelName - The name of the mongoose model   
 * @param {Array} fields - Array of fields to select from the database
 * @returns {Promise<Array>} Array of documents matching the selected fields
 */
export const fetchDataByFieldsAndQuery = async (modelName, operation, fields, query, distinctField) => {
  try {
    logger.info("Starting execution of fetchDataByFieldsAndQuery");
    const Model = mongoose.model(modelName);
    let queryBuilder;
    switch (operation) {
      case 'findOne':
        queryBuilder = Model.findOne();
        break;
      case 'find':
        queryBuilder = Model.find();
        break;
      case 'distinct':
        queryBuilder = Model.find()
        break;
      default:
        throw new Error('Invalid operation. Supported operations are findOne or find or distinct.');
    }

    if (Array.isArray(fields) && fields.length > 0) {
      queryBuilder.select(fields.join(' '));
    }
    switch (operation) {
      case 'findOne':
      case 'find':
        if (query && typeof query === 'object') {
          queryBuilder = queryBuilder.where(query);
        }
      // break;
      // break;
    }
    if (ENABLE_QUERY == "YES") {
      mongoose.set('debug', (collectionName, method, query) => {
        logger.info(` <<< Query Log >>> \n db.${collectionName}.${method}(${JSON.stringify(query)}) `);
      });
    }
    const result = await queryBuilder.exec();
    return result;
  } catch (error) {
    logger.error('Error during execution of fetchDataByFieldsAndQuery \n', error);
    throw error;
  }
};

/**
* Counts documents in a MongoDB collection.
* 
* @param {mongoose.Model} modelName - The Mongoose model to query.
* @param {Object} filter - The filter object to apply to the query.
* @returns {Promise<Number>} - The count of documents that match the filter.
*/
export const countDocuments = async (modelName, filter = {}) => {
  logger.info('Starting execution of the countDocuments');
  try {
    const model = mongoose.model(modelName);
    const count = await model.countDocuments(filter) || 0;
    return count;
  } catch (error) {
    logger.error('Error occurred while executing countDocuments\n' + error);
    throw error;
  }
}

