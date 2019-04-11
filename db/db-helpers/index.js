const userHelpers = require('./userHelpers');
const commentHelpers = require('./commentHelpers');

module.exports = {
  ...userHelpers,
  ...commentHelpers,
};
