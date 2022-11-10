const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const salt = 11;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => res.render("auth/login"));

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.render("auth/signup", {
        errorMessage: "Both username and password are required !",
      });
    }

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      //means username already used
      return res.render("auth/signup", {
        errorMessage:
          "Username is already taken, try again with another username !",
      });
    }
    const generatedSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, generatedSalt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect("/"); //redirect toward homepage
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Either username or email is already used.",
      });
    }
    next(error);
  }
  res.render("auth/signup");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.render("auth/login", {
        errorMessage: "Both username and password are required !",
      });
    }

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      //means username not found
      return res.render("auth/login", {
        errorMessage:
          "Unknown username... :/ Check your username or create your account !",
      });
    }

    const samePassword = await bcrypt.compare(password, foundUser.password);

    if (!samePassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong password",
      });
    }

    req.session.currentUser = foundUser; // we can named it user too
    console.log("redirectprofile connected to user");
    res.redirect("/profile"); //redirect to profile page
  } catch (error) {
    next(error);
    res.render("auth/signup");
  }
});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
});

module.exports = router;
