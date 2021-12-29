const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Users = require("../Models/users");
const bcrypt = require("bcrypt");
const jwthandler = ({ id, type }) => {
  return jwt.sign({ id, type }, "secret hash key", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
const signup_post = async (req, res) => {
  let { email, password, type } = req.body;
  //user can signup with only type delivery or customer
  if (type == "admin") {
    res.send("you are not authorized");
  }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  //save the document to collection Users
  const userdoc = new Users({ email, password, type });
  userdoc
    .save()
    .then((user) => {
      const token = jwthandler({ id: user._id, type: user.type });
      res.json({ token });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(401).json({ error: "error_obj_thrown" });
    });
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exists
    const user = await Users.findOne({ email });
    if (!user) {
      throw Error("Incorrect email id");
    }
    //check if password matches
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw Error("Incorrect password");
    }
    //since user exists and password is correct, generate a token and send it
    const token = jwthandler({ id: user._id, type: user.type });
    console.log("token in login", user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(401).json({ err });
  }
};
router.post("/signup", signup_post);
router.post("/login", login_post);
router.get("/login", (req, res) => {
  res.send("frontend code for login page");
});
router.get("/signup", (req, res) => {
  res.send("frontend code for signup page");
});
module.exports = router;
