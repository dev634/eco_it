const { render, redirect } = require("../helpers/server");
const UsersModel = require("../models/users");

async function instructors(req, res) {
  try {
    const instructors = await UsersModel.getUser({ role: "instructor" });
    console.log(instructors);
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
    const instructor = await InstructorsModel.getById(req.params.id);

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

module.exports = {
  instructors,
  instructor,
};
