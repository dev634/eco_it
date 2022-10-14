function makeResponse(res, payload) {
  res.status(payload.status).json(payload);
}

module.exports = {
  makeResponse,
};
