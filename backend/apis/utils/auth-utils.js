exports.checkUserRole = function(req, role) {
  return req.session.passport.user.accessLevel === role
    ? null
    : `User does not have sufficient privileges`;
};
