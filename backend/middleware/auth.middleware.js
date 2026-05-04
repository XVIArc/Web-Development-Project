const jwt = require("jsonwebtoken");

// TODO: verify the JWT and attach the decoded payload to req.user
//
// steps:
//   1. pull the token out of the Authorization header ("Bearer <token>")
//   2. missing -> 401
//   3. jwt.verify(), invalid or expired -> 401
//   4. set req.user = { id, username, role } and call next()
//
// every protected route (quiz + admin) depends on req.user being set here

const auth = (req, res, next) => {};

module.exports = auth;
