const router = require("express").Router();

const { isLoggedIn } = require("./../middlewares/middlewares");

router.use("/auth", require("./auth.routes"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});
router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log(req.session.currentUser);
  res.render("profile", { currentUser: req.session.currentUser });
});

module.exports = router;
