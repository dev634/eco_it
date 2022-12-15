const { render, redirect } = require("../helpers/server");
const UsersModel = require("../models/users");
const searchSchema = require("../validation/instructors");
const Logger = require("../Services/logger");
const { HttpErrors } = require("../helpers/errors");
const Database = require("../Services/database");

function makeSettings(query) {
  const settings = {};
  const DEFAULT_LIMIT = 10;

  if (Object.keys(query).length === 0) {
    settings.orderby = "firstname";
    settings.limit = 10;
    settings.page = 0;
    return Object.freeze({ ...settings });
  }

  if (!Object.keys(query).every((elmt) => ["orderby", "limit", "page"].includes(elmt))) {
    throw "Bad request";
  }

  if (typeof query.orderby !== "string") {
    throw "Bad request";
  }

  if (!["firstname", "lastname"].includes(query.orderby)) {
    throw "orderby should be equal to firstname/lastname";
  }

  if (isNaN(parseInt(query.limit)) || isNaN(parseInt(query.page))) {
    throw "Bad request";
  }

  settings.orderby = query.orderby ? query.orderby : "firstname";
  settings.limit = query.limit ? query.limit : DEFAULT_LIMIT;
  settings.page = query.page ? query.page * DEFAULT_LIMIT - DEFAULT_LIMIT : DEFAULT_LIMIT;

  return Object.freeze({ ...settings });
}

async function instructors(req, res) {
  try {
    const settings = makeSettings(req.query);

    let pages = [];
    const total = await Database.getTotalRows({ role: "instructor" }, "users", null);

    const instructors = await UsersModel.getUser(
      { role: "instructor" },
      [
        "id",
        "firstname",
        "lastname",
        "email",
        "photo",
        "isapprouved",
        "created_at",
        "connected_at",
      ],
      { ...settings }
    );

    const calculate = settings.limit ? Math.ceil(total / settings.limit) : Math.ceil(total / 10);

    for (let i = 0; i < calculate; i++) {
      pages.push({
        url: `/admin/instructors?orderby=firstname&limit=${
          settings.limit ? settings.limit : 10
        }&page=${i + 1}`,
        number: i + 1,
      });
    }

    render(res, "instructors", {
      pageTitle: "instructeurs",
      layout: "admin",
      goBack: true,
      instructors,
      pages,
    });
  } catch (error) {
    Logger(error);
    redirect(res, "404");
  }
}

async function instructor(req, res) {
  try {
    const instructor = await UsersModel.getUser({ id: req.params.id, role: "instructor" }, [
      "id",
      "firstname",
      "lastname",
      "email",
      "photo",
      "isapprouved",
      "created_at",
      "connected_at",
    ]);

    render(res, "instructor", {
      pageTitle: `${instructor[0].firstname} ${instructor[0].lastname}`,
      layout: "admin",
      goBack: true,
      instructor: instructor[0],
      alt: "Instructor photo",
    });
  } catch (error) {
    Logger(error);
    redirect(res, "/404");
  }
}

async function instructorsAll(req, res) {
  try {
    const settings = {
      orderby: req.query.orderby ? req.query.orderby : "firstname",
      limit: req.query.limit ? req.query.limit : 10,
      page: req.query.page ? req.query.page : "",
    };
    const instructors = await UsersModel.getUser(
      { role: "instructor" },
      [
        "id",
        "firstname",
        "lastname",
        "email",
        "photo",
        "isapprouved",
        "created_at",
        "connected_at",
      ],
      { ...settings }
    );
    res.json(instructors);
  } catch (error) {
    Logger(error);
    res.status(500).json(HttpErrors.Internal());
  }
}

async function search(req, res) {
  try {
    const value = await searchSchema.search.validateAsync({ ...req.body });
    const { orderby, limit, page } = req.body;

    const instructors = await UsersModel.getUsers(
      { firstname: req.body.firstname, lastname: req.body.lastname, role: "instructor" },
      [
        "id",
        "firstname",
        "lastname",
        "email",
        "photo",
        "isapprouved",
        "created_at",
        "connected_at",
      ],
      false,
      false,
      { orderby, limit: "", page: "" }
    );

    return res.json(instructors);
  } catch (error) {
    Logger(error);
    if (error.isJoi) {
      if (error.details[0].type === "string.pattern.base") {
        return res.status(404).json([]);
      }
      return res.status(500).json(HttpErrors.Internal());
    }

    return redirect(res, "/404");
  }
}

module.exports = {
  instructors,
  instructor,
  instructorsAll,
  search,
};
