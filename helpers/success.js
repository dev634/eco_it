function HttpSuccess(status, msg) {
  this.status = status;
  this.message = msg;
}

HttpSuccess.Created = function (msg) {
  if (msg) {
    return new HttpSuccess(201, msg);
  }

  return new HttpSuccess(201, "Successfully created.");
};

HttpSuccess.Success = function (msg) {
  if (msg) {
    return new HttpSuccess(200, msg);
  }

  return new HttpSuccess(200, "Success");
};

module.exports = {
  HttpSuccess,
};
