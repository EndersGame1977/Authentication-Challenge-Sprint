const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model.js");
const secrets = require("../config/secrets.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // new line

        // the server needs to return the token to the client
        // this doesn't happen automatically like it happens with cookies
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token // attach the token as part of the response
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
