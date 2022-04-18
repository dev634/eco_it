function render(res, template, datas) {
  res.render(template, datas);
}

function redirect(res, url) {
  res.redirect(url);
}

module.exports = {
  render,
};
