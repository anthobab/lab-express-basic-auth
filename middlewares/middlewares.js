function exposeUserToView(req, res, next) {
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser; //in hbs create local var
    res.locals.isLoggedIn = true;
  }
  next();
}

function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    next();
    return;
  }
  console.log("isloggedIn failed");
  res.redirect("/auth/signup");
}

module.exports = {
  isLoggedIn,
  exposeUserToView,
};
