function HttpSuccess(status, msg) {
  this.status = status;
  this.message = msg;
  return {
    status,
    message: msg,
  };
}

HttpSuccess.Created = function (msg) {
  if (msg) {
    return new HttpSuccess(201, msg);
  }
  return new HttpSuccess(201, "Created successfully.");
};

HttpSuccess.Deleted = function (msg) {
  if (msg) {
    return new HttpSuccess(200, msg);
  }

  return new HttpSuccess(200, "Deleted succesfully");
};

HttpSuccess.Updated = function (msg) {
  if (msg) {
    return new HttpSuccess(200, msg);
  }
  return new HttpSuccess(200, "Updated successfully");
};

HttpSuccess.Success = function (msg) {
  if (msg) {
    return new HttpSuccess(200, msg);
  }

  return new HttpSuccess(200, "Success");
};

module.exports = HttpSuccess;
