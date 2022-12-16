'use strict';

const _ = require('lodash');

/**
 * Stringify a value or value array.
 *
 * @param {Any} value - The value to stringify.
 * @return {String|Array} The processed value.
 */
exports = module.exports = value => {
  if (_.isArray(value)) {
    return value.map(v => v.toString());
  }

  return value.toString();
};
