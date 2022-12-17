const { LIMIT, ORDERBY, PAGE, INSTRUCTORS_ORDERBY_ALLOWED } = require("../constantes/default");

function makeSettings(query) {
  const settings = {};

  if (Object.keys(query).length === 0) {
    settings.orderby = ORDERBY;
    settings.limit = LIMIT;
    settings.page = 0;
    return Object.freeze({ ...settings });
  }

  if (!Object.keys(query).every((elmt) => ["orderby", "limit", "page"].includes(elmt))) {
    throw "Bad request";
  }

  if (typeof query.orderby !== "string") {
    throw "Bad request";
  }

  if (!INSTRUCTORS_ORDERBY_ALLOWED.includes(query.orderby)) {
    throw "orderby should be equal to firstname, lastname or created_at";
  }

  if (isNaN(parseInt(query.limit)) || isNaN(parseInt(query.page))) {
    throw "Bad request";
  }

  settings.orderby = query.orderby ? query.orderby : ORDERBY;
  settings.limit = query.limit ? query.limit : LIMIT;
  settings.page = query.page ? query.page * LIMIT - LIMIT : LIMIT;

  return Object.freeze({ ...settings });
}

function makeDropdown(query) {
  const dropdown = [
    { text: "ORDER BY" },
    {
      text: "Firstname",
      page: query.page ? query.page : PAGE,
      limit: query.limit ? query.limit : LIMIT,
      orderby: "firstname",
      url: "http://localhost:3000",
    },
    {
      text: "Lastname",
      page: query.page ? query.page : PAGE,
      limit: query.limit ? query.limit : LIMIT,
      orderby: "lastname",
      url: "http://localhost:3000",
    },
    {
      text: "Creation date",
      page: query.page ? query.page : PAGE,
      limit: query.limit ? query.limit : LIMIT,
      orderby: "created_at",
      url: "http://localhost:3000",
    },
  ];
  return [...dropdown];
}

module.exports = {
  makeDropdown,
  makeSettings,
};
