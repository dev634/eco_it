const { render, redirect } = require("../helpers/server");
const UsersModel = require("../models/users");

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
    redirect(res, "/404");
  }
}

async function search(req, res) {
  try {
    return;
  } catch (error) {
    redirect(res, "404");
  }
}

module.exports = {
  instructors,
  instructor,
  search,
};
