const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

function Database() {
  let pool = null;
  let table = null;
  let tablesList = null;
  let fields = [];
  let logger = null;
  let request = null;
  return pool;
}

function isFunction(argName, arg) {
  if (typeof arg !== "function" && arg !== null) {
    throw new Error(`${argName} should be a function or null`);
  }
  return true;
}

function isObject(argName, arg) {
  if (typeof arg !== "object" && !arg instanceof Object) {
    throw new Error(`${argName} should be an object`);
  }
  return true;
}

function isArray(argName, arg) {
  if (typeof arg === "object" && !arg instanceof Array) {
    throw new Error(`${argName} should be an Array`);
  }
  return true;
}

function isString(argName, arg) {
  if (typeof arg !== "string") {
    throw new Error(`${argName} should be an string`);
  }
  return true;
}

function isBoolean(argName, arg) {
  if (typeof arg !== "boolean") {
    throw new Error(`${argName} sould be a boolean`);
  }
  return true;
}

function isInteger(argName, arg) {
  if (typeof arg !== "number") {
    throw new Error(`${argName} should be an integer`);
  }
  return true;
}

function checkResponseFields(responseFields, error) {
  // test if the array of responseFields is an array of string
  if (responseFields instanceof Array && responseFields.length > 0) {
    let testResponseFields = responseFields.every((elmt) => typeof elmt === "string");
    if (!testResponseFields) {
      throw "responseFields should be an array of strings";
      return;
    }

    if (!this.fields.includesAll(responseFields)) {
      throw "the responseFields list is not compliant";
      return;
    }
  }
}

function checkPayload(payload, error) {
  // test if payload object exists
  if (!payload) {
    if (error) {
      throw error;
    }

    throw "The payload object is required";
  }

  if (Object.keys(payload).length === 0) {
    throw "The payload object cannot be empty";
  }
}

function checkTable(table, error) {
  // test if all the table are here
  if (!table) {
    if (error) {
      throw error;
    }

    throw "The table argument is required";
  }
}

function checkIfTableExists(table, error) {
  // compare if the table does exists in the database
  if (!this.tablesList.includes(table)) {
    if (error) {
      throw error;
    }

    throw "This table doesn't exists in the database";
  }
}

function checkTableFields(payload, error) {
  // compare the payload property names with the fields of a given table
  if (!this.fields.includesAll(Object.keys(payload))) {
    if (error) {
      throw error;
    }

    throw "Something wrong with the payload and the fields";
  }
}

// make select request
function makeSelectRequest(payload, table, responseFields, settings) {
  let userRequest = "SELECT ";
  if (responseFields.length === 0) {
    userRequest += "* ";
  }

  if (responseFields.length > 0) {
    userRequest += responseFields.toString() + " ";
  }

  userRequest += `FROM ${table} WHERE `;

  Object.keys(payload).map((elmt, idx) => {
    if (idx === Object.keys(payload).length - 1) {
      userRequest += `${elmt} = $${idx + 1}`;
      return;
    }
    userRequest += `${elmt} = $${idx + 1} AND `;
  });

  if (!!settings) {
    if (settings.orderby) {
      userRequest += `ORDER BY ${settings.orderby} `;
    }

    if (settings.limit) {
      userRequest += `LIMIT ${settings.limit} `;
    }

    if (settings.page) {
      userRequest += `OFFSET ${settings.offset} `;
    }
  }

  return userRequest;
}

// make insert request
function makeInsertRequest(payload, table, responseFields) {
  if (Object.keys(payload).includes("id")) {
    throw "payload cannot contain id field";
  }

  let insertRequest = "INSERT INTO ";
  insertRequest += `${table}(${Object.keys(payload)})`;
  insertRequest += `VALUES(`;
  insertRequest += Object.keys(payload).map((elmt, idx) => {
    return `$${idx + 1}`;
  });
  insertRequest += `)` + " ";
  if (responseFields.length === 0) {
    insertRequest += "RETURNING *";
  }
  if (responseFields.length > 0) {
    insertRequest += `RETURNING ${responseFields.toString()}`;
  }
  return [insertRequest, Object.values(payload)];
}

// make update request
function makeUpdateRequest(payload, table, where, responseFields) {
  if (!where) {
    throw "where arguments is required";
  }

  if (payload.id) {
    delete payload.id;
  }

  let updateRequest = `UPDATE ${table} SET `;
  Object.entries(payload).map((elmt, idx) => {
    if (elmt === "id") {
      return;
    }
    if (idx + 1 === Object.keys(payload).length) {
      updateRequest += `${elmt[0]} = $${idx + 1} `;
      return;
    }
    updateRequest += `${elmt[0]} = $${idx + 1}, `;
    return;
  });

  updateRequest += "WHERE ";
  Object.entries(where).map((elmt, idx) => {
    if (idx + 1 === Object.keys(where).length) {
      updateRequest += `${elmt[0]} = ${elmt[1]} `;
      return;
    }
    updateRequest += `${elmt[0]} = ${elmt[1]} AND `;
  });

  if (responseFields.length === 0) {
    updateRequest += `RETURNING *`;
  }

  if (responseFields.length > 0) {
    updateRequest += `RETURNING ${responseFields.toString()}`;
  }
  return [updateRequest, Object.values(payload)];
}

function makeDeleteRequest(table, where, responseFields) {
  if (!where) {
    throw "where arguments is required";
  }

  let deleteRequest = `DELETE FROM ${table} WHERE` + " ";
  let values = Object.entries(where).map((field, idx) => {
    if (idx + 1 === Object.keys(field).length) {
      deleteRequest += `${field[0]} ${field[1].op} $${idx + 1} `;
      return field[1].value;
    }

    deleteRequest += `${field[0]} ${field[1].op} $${idx + 1} AND `;
    return field[1].value;
  });

  if (responseFields.length === 0) {
    deleteRequest += `RETURNING *`;
  }

  if (responseFields.length > 0) {
    deleteRequest += `RETURNING ${responseFields.toString()}`;
  }

  return [deleteRequest, values];
}

function makeSearchRequest(table, where, responseFields, all, settings) {
  if (!where) {
    throw "where arguments is required";
  }

  let searchRequest = "SELECT ";

  if (responseFields.length === 0) {
    searchRequest += "* ";
  }

  searchRequest += `${responseFields.toString()} FROM ${table} WHERE `;

  Object.entries(where).map((field, idx) => {
    if (idx + 1 === Object.keys(field).length) {
      searchRequest += `${field[0]} ${field[1].sensitive ? "LIKE" : "ILIKE"} '%${
        field[1].value
      }%' `;
      return;
    }

    if (all) {
      searchRequest += `${field[0]} ${field[1].sensitive ? "LIKE" : "ILIKE"} '%${
        field[1].value
      }%' AND `;
      return;
    }

    if (!all) {
      searchRequest += `${field[0]} ${field[1].sensitive ? "LIKE" : "ILIKE"} '%${
        field[1].value
      }%' OR `;
      return;
    }

    return true;
  });

  if (settings) {
    if (settings.orderby) {
      searchRequest += `ORDER BY ${settings.orderby} `;
    }

    if (settings.limit) {
      searchRequest += `LIMIT ${settings.limit} `;
    }

    if (settings.page) {
      searchRequest += `OFFSET ${settings.page} `;
    }
  }

  return searchRequest;
}

function makeValuesList(payload) {
  return Object.values(payload);
}

function checkArgsLength(args, length) {
  if (Object.values(args).length !== length) {
    throw new Error(`Arguments numbers should be equal to ${length}`);
  }
  return true;
}

function checkAllArguments(argsNames, args, tests = [], length) {
  checkArgsLength(args, length);
  return Object.values(args).every((elmt, idx) => {
    return tests[idx](argsNames[idx], elmt);
  });
}

function checkSettings(settings) {
  if (Object.keys(settings).includesAll(["orderby", "limit", "page"])) {
    return true;
  }

  throw "Settings should contain orderBy and limit and offset";
}

function checkGetByArguments(argsNames, args, length) {
  return true;
}

Database.prototype.init = async function (credentials, table, logger, makeDbErrors, schema) {
  // initialize the database query builder
  let tablesRequest = `SELECT * FROM information_schema.tables WHERE table_schema = '${schema}'`;
  let fieldsRequest = `SELECT * FROM ${table} WHERE false`;
  let fieldsResult = null;
  let tablesResult = null;
  this.logger = logger;
  this.makeDbErrors = makeDbErrors;
  this.pool = new Pool({ ...credentials });
  this.table = table;
  tablesResult = await this.pool.query(tablesRequest);
  this.tablesList = tablesResult.rows.map((elmt) => elmt.table_name);
  fieldsResult = await this.pool.query(fieldsRequest);
  this.fields = fieldsResult.fields.map((elmt) => elmt.name);
};

Database.prototype.getById = async function (id, table, responseFields, error) {
  try {
    /* 
      select attname AS table_id from pg_attribute where attnum > 0 and attrelid = 
      (select oid from pg_class where relname = 'users') and attidentity = 'a';
    */
    checkAllArguments.call(
      this,
      ["id", "table", "responseFields", "error"],
      arguments,
      [isObject, isString, isArray, isFunction],
      4
    );
    checkTable.call(this, table, error);
    checkResponseFields.call(this, responseFields, error);
    const request = `SELECT ${responseFields.toString()} FROM ${table} WHERE ${
      Object.keys(id)[0]
    } = $1`;
    const id = Object.values(id)[0];
    const result = await this.pool.query(request, id);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.prototype.getBy = async function (
  payload,
  table,
  responseFields = [],
  error = null,
  settings = undefined
) {
  try {
    checkAllArguments.call(
      this,
      ["payload", "table", "responseFields", "error", "settings"],
      arguments,
      [isObject, isString, isArray, isFunction, isObject],
      5
    );

    checkResponseFields.call(this, responseFields, error);
    checkPayload.call(this, payload, error);
    checkTable.call(this, table, error);
    checkIfTableExists.call(this, table, error);
    checkTableFields.call(this, payload, error);

    if (!!settings) {
      checkSettings.call(this, settings, error);
    }

    const selectRequest = makeSelectRequest(payload, table, responseFields, settings);
    const values = makeValuesList.call(this, payload);
    const result = await this.pool.query(selectRequest, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.prototype.create = async function (payload, table, responseFields = [], error = null) {
  try {
    checkAllArguments.call(
      this,
      ["payload", "table", "responseFields", "error"],
      arguments,
      [isObject, isString, isArray, isFunction],
      4
    );
    checkResponseFields.call(this, responseFields, error);
    checkPayload.call(this, payload, error);
    checkTable.call(this, table, error);
    checkIfTableExists.call(this, table, error);
    checkTableFields.call(this, payload, error);
    let request = makeInsertRequest(payload, table, responseFields);
    const result = await this.pool.query(request[0], request[1]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.prototype.update = async function (
  payload,
  table,
  where,
  responseFields = [],
  error = null
) {
  try {
    checkAllArguments.call(
      this,
      ["payload", "table", "where", "responseFields", "error"],
      arguments,
      [isObject, isString, isObject, isArray, isFunction],
      5
    );
    checkResponseFields.call(this, responseFields, error);
    checkPayload.call(this, payload, error);
    checkTable.call(this, table, error);
    checkIfTableExists.call(this, table, error);
    checkTableFields.call(this, payload, error);
    checkTableFields.call(this, where, error);
    let request = makeUpdateRequest(payload, table, where, responseFields);
    const result = await this.pool.query(request[0], request[1]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.prototype.delete = async function (table, where, responseFields = [], error = null) {
  try {
    checkAllArguments.call(
      this,
      ["table", "where", "responseFields", "error"],
      arguments,
      [isString, isObject, isArray, isFunction],
      4
    );
    checkResponseFields.call(this, responseFields, error);
    checkTable.call(this, table, error);
    checkPayload.call(this, where, error);
    checkIfTableExists.call(this, table, error);
    checkTableFields.call(this, where, error);

    let request = makeDeleteRequest(table, where, responseFields);
    const result = await this.pool.query(request[0], request[1]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.prototype.find = async function (
  table,
  where,
  responseFields = [],
  all = false,
  error = null,
  settings = {}
) {
  try {
    checkAllArguments.call(
      this,
      ["table", "where", "responseFields", "all", "error", "settings"],
      arguments,
      [isString, isObject, isArray, isBoolean, isFunction, isObject],
      6
    );
    checkResponseFields.call(this, responseFields, error);
    checkTable.call(this, table, error);
    checkIfTableExists.call(this, table, error);
    checkTableFields.call(this, where, error);
    checkSettings.call(this, settings, error);

    let request = makeSearchRequest(table, where, responseFields, all, settings);
    const result = await this.pool.query(request);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = new Database();
