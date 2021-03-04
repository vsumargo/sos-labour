// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body.email, req.body.password, req.body.user_type)
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      user_type: req.body.user_type

    })
      .then(function() {
        console.log("sucesss")
        console.log(req.body.user_type)
        res.redirect(307, "/api/login");
        
      })
      .catch(function(err) {
        console.log("fail")
        console.log(err)
        res.status(401).json(err);
      });
  });

  app.post("/api/labourerdetails", function(req, res) {
    console.log(req.body.first_name, req.body.last_name, req.body.dob, req.body.driver_license, 
      req.body.whitecard, req.body.skills_experience)
    db.Labourer.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name, 
      dob: req.body.dob,
      driver_license: req.body.driver_license ,
      whitecard: req.body.whitecard, 
      skills_experience: req.body.skills_experience,
      UserId: req.body.UserId
    })
      .then(function() {
        res.redirect("/members");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/companydetails", function(req, res) {
    console.log(req.body.company_name, req.body.abn, req.body.UserId )
    db.Company.create({
      company_name: req.body.company_name,
      abn: req.body.abn, 
      UserId: req.body.UserId
    })
      .then(function() {
        res.redirect("/members");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    console.log(req.user)
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
