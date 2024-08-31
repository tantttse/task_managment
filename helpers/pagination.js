module.exports = (paginationObject, query, totals) => {
  if (query.page) {
    let number = parseInt(query.page);
    if (isNaN(number)) {
      paginationObject.currentPage = 1;
    }else{
      paginationObject.currentPage = number;
    }
  }

  let totalPages = Math.ceil(totals / paginationObject.limitObject)
  paginationObject.totalPages=totalPages;
  // console.log(totalPages);

  paginationObject.skip =
    (paginationObject.currentPage - 1) * paginationObject.limitObject;

    return paginationObject;
};
