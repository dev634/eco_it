const { render, redirect } = require("../helpers/server");
const UsersModel = require("../models/users");
const searchSchema = require("../validation/instructors");
const Logger = require("../Services/logger");
const { HttpErrors } = require("../helpers/errors");
const Database = require("../Services/database");
const { makeSettings, makeDropdown, makePages } = require("../helpers/makers");
const querySchema = require("../validation/query");

async function instructors(req, res) {
  try {
    const validQuery = await querySchema.query.validateAsync({ ...req.query });
    const total = await Database.getTotalRows({ role: "instructor" }, "users", null);
    const { allPages, currentPagination, next, prev, currentPage } = makePages(
      "/admin/instructors",
      validQuery,
      total,
      5
    );
    const dropdown = makeDropdown(req.query);
    const instructors = await UsersModel.getUser(
      { role: "instructor" },
      [
        "id",
        "firstname",
        "lastname",
        "role",
        "email",
        "photo",
        "isapprouved",
        "created_at",
        "connected_at",
      ],
      { ...validQuery }
    );

    render(res, "instructors", {
      pageTitle: "instructeurs",
      layout: "admin",
      goBack: true,
      instructors,
      currentPage,
      query: validQuery,
      pages: currentPagination,
      dropdown,
      next,
      prev,
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
