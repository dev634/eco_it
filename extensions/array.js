if (!Array.prototype.includesAll) {
  Array.prototype.includesAll = function (src) {
    return src.every((elmt) => this.includes(elmt));
  };
}
