const dotenv = require("dotenv");
dotenv.config();

function displayError(error) {
  return console.log(error);
}

//databse errors
function DatabaseErrors(status, msg) {
  this.code;
}

//http errors
function HttpErrors(status, msg) {
  this.status = status;
  this.message = msg;

  return {
    status: status,
    message: msg,
  };
}

HttpErrors.BadRequest = function (msg) {
  if (msg) {
    return new HttpErrors(400, msg);
  }
  return new HttpErrors(400, "Bad request");
};

HttpErrors.Unauthorized = function (msg) {
  if (msg) {
    return new HttpErrors(401, msg);
  }
  return new HttpErrors(401, "Unauthorized");
};

HttpErrors.Forbidden = function (msg) {
  if (msg) {
    return new HttpErrors(403, msg);
  }
  return new HttpErrors(403, "Forbidden");
};

HttpErrors.NotFound = function (msg) {
  if (msg) {
    return new HttpErrors(404, msg);
  }
  return new HttpErrors(404, "Not Found");
};

HttpErrors.Conflict = function (msg) {
  if (msg) {
    return new HttpErrors(409, msg);
  }
  return new HttpErrors(409, "Conflict");
};

HttpErrors.Internal = function (msg) {
  if (msg) {
    return new HttpErrors(500, msg);
  }
  return new HttpErrors(500, "Internal Error");
};

makeDbErrors = function (error) {
  if (error.code === "23505") {
    throw {
      status: 409,
      message: "This user already exists",
    };
  }

  throw {
    status: 500,
    message: "Something went wrong",
  };
};

module.exports = {
  DatabaseErrors,
  makeDbErrors,
  HttpErrors,
};
