// TODO: check that the logged-in user is actually an admin
//
// auth middleware runs first and sets req.user, so just check:
//   req.user.role !== "admin" → 403
//   otherwise call next()

const admin = (req, res, next) => {};

module.exports = admin;
