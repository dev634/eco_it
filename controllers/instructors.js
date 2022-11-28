const { render, redirect } = require("../helpers/server");
const UsersModel = require("../models/users");
const searchSchema = require("../validation/instructors");
const Logger = require("../Services/logger");

async function instructors(req, res) {
  try {
    const instructors = await UsersModel.getUser({ role: "instructor" }, [
      "id",
      "firstname",
      "lastname",
      "email",
      "photo",
      "isapprouved",
      "created_at",
      "connected_at",
    ]);
    render(res, "instructors", {
      pageTitle: "instructeurs",
      layout: "admin",
      goBack: true,
      instructors,
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
    const instructors = await UsersModel.getUser({ role: "instructor" }, [
      "id",
      "firstname",
      "lastname",
      "email",
      "photo",
      "isapprouved",
      "created_at",
      "connected_at",
    ]);
    res.json(instructors);
  } catch (error) {
    Logger(error);
    res.status(500).json(HttpErrors.Internal());
  }
}

async function search(req, res) {
  try {
    const value = await searchSchema.search.validateAsync({ ...req.body });
    const instructors = await UsersModel.getUsers(
      { firstname: req.body.firstname, lastname: req.body.lastname, role: "instructor" },
      ["id", "firstname", "lastname", "email", "photo", "isapprouved", "created_at", "connected_at"]
    );
    return res.json(instructors);
  } catch (error) {
    Logger(error);
    if (error.isJoi) {
    }
    redirect(res, "404");
  }
}

module.exports = {
  instructors,
  instructor,
  instructorsAll,
  search,
};
