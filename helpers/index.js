const dbValidator = require('./db-validators');
const genmerateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./uoload-file');

module.exports = {
  ...dbValidator,
  ...genmerateJWT,
  ...googleVerify,
  ...uploadFile,
}