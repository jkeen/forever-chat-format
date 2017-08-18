var validate = require("./validate");
var runTests = require("./test");

function prepare(data) {
  return {
    messages: data,
    validations: validate(data)
  };
}

module.exports = { validate, runTests, prepare };
