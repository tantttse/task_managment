module.exports = (query) => {
    let searchObject = {
        keyword: ""
    };

    if (query.keyword) {
        searchObject.keyword = query.keyword;
        let regex = new RegExp(searchObject.keyword, "i");
        searchObject.regex = regex;  // Corrected the typo here
    }

    return searchObject;
};
