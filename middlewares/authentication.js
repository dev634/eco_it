const { verifyAccessToken, getAudience } = require("../helpers/jwt_help");
const { createUser } = require("../helpers/request");
const { redirect } = require("../helpers/server");
const { checkCookie } = require("../helpers/cookies");
const AdminModel = require("../models/admin");
const { HttpErrors } = require("../helpers/errors");

async function checkAdminMiddleware(req, res, next) {
  try {
    const adminExists = await AdminModel.getAdmin({ role: "Administrator" });
    if (adminExists.length === 0) {
      res.redirect("/admin/auth/subscribe");
      return;
    }

    next();
  } catch (error) {
    res.redirect("/admin/auth/subscribe");
    return;
  }
}

async function checkCookieMiddleware(req, res, next) {
  try {
    let adminToken = null;

    if (!checkCookie(req, "access_token")) {
      res.redirect("/admin/auth/connect");
      return;
    }

    const tokenCompliant = await verifyAccessToken(req["cookies"]["access_token"]);

    if (!tokenCompliant) {
      res.redirect("/admin/auth/connect");
      return;
    }

    adminToken = await getAudience(req["cookies"]["access_token"]);
    await createUser(req, adminToken);
    next();
  } catch (error) {
    res.redirect("/admin/auth/connect");
    return;
  }
}

async function checkRoleMiddleware(req, res, next, role) {
  const user = await getUserBy({ id: req.user.userId, role: "Administrator" });

  if (!role.includes(user.role)) {
    res.redirect("/admin/auth/connect");
    return;
  }

  next();
}

function checkRole(roles, action) {
  return async function (req, res, next, roles, action) {
    try {
      const user = await getUserBy({ id: req.user.userId });

      if (!roles.includes(user.role)) {
        throw { status: "500", message: "test" };
      }
      next();
    } catch (error) {
      console.log(error);
      return action;
    }
  };
}

module.exports = {
  checkAdminMiddleware,
  checkRoleMiddleware,
  checkCookieMiddleware,
  checkRole,
};
