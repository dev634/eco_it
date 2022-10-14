async function createUser(req, token) {
  if (token) {
    req.user = { ...token };
    return;
  }
}

module.exports = {
  createUser,
};
