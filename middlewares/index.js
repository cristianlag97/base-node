const validateFile = require('./validate-file');
const validateInputs = require('../middlewares/validate-inputs');
const validateJWT = require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');

module.exports = {
  ...validateFile,
  ...validateInputs,
  ...validateJWT,
  ...validateRole,
}