const { LIMIT, ORDERBY, PAGE, INSTRUCTORS_ORDERBY_ALLOWED } = require("../constantes/default");

function makeSettings(query) {
  const settings = {};

  if (Object.keys(query).length === 0) {
    settings.orderby = ORDERBY;
    settings.limit = LIMIT;
    settings.page = 0;
    return Object.freeze({ ...settings });
  }

  if (!Object.keys(query).every((elmt) => ["orderby", "limit", "page", "action"].includes(elmt))) {
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
  settings.action = query.action ? query.action : "";

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

function calculateTotalPages(limit, totalRows, maxPages) {
  if (totalRows % limit === 0) {
    return totalRows / limit;
  }

  if (totalRows % limit > 0) {
    return Math.ceil(totalRows / limit);
  }

  return Math.ceil(totalRows / limit / maxPages);
}

function makePages(url, query, totalRows, maxPerBigPage) {
  let pages = [];
  let bigPages = [];
  const { limit, orderby, page } = query;

  //bigPages creation array for prev and next
  for (
    let i = 0;
    i < Math.ceil(totalRows / (query.limit ? query.limit : LIMIT) / maxPerBigPage);
    i++
  ) {
    bigPages.push([]);
  }

  //create the previous/next
  bigPages.map((elmt, idx) => {
    let counter = 0;

    if (idx === 0) {
      counter = maxPerBigPage;
    }

    if (idx === 1) {
      counter = Math.ceil(totalRows / 30) - maxPerBigPage;
    }

    if (idx > 1) {
      counter = Math.ceil(totalRows / 30) - maxPerBigPage * (idx - 1);
    }

    for (let i = 0; i < counter; i++) {
      elmt.push({
        url: `${url}?orderby=${query.orderby ? query.orderby : ORDERBY}&limit=${
          limit ? limit : LIMIT
        }&page=${idx * maxPerBigPage + i + 1}`,
        number: idx * maxPerBigPage + i + 1,
      });
    }

    return elmt;
  });

  let currentPaginationIndex =
    Math.ceil(((page ? page : 1) * limit) / maxPerBigPage / (limit ? limit : LIMIT)) - 1;

  if (query.action === "next") {
    query.page = maxPerBigPage + 1;
    currentPaginationIndex += 1;
  }

  if (query.action === "prev") {
    query.page = bigPages[currentPaginationIndex][0].number;
  }

  return {
    currentPage: query.page,
    allPages: [...bigPages],
    currentPagination: bigPages[currentPaginationIndex],
    next: currentPaginationIndex < bigPages.length - 1,
    prev: currentPaginationIndex > 0 && currentPaginationIndex < bigPages.length,
  };
}

module.exports = {
  makeDropdown,
  makeSettings,
  makePages,
};
