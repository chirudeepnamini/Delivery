const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userAuth = require("./auth/userAuth");
const drivers = require("./Controllers/drivers");
const order_processing = require("./Controllers/orderprocessing");
const { orderlist_status, orderlist } = require("./Controllers/orderlist");
const assigndriver = require("./Controllers/assigndriver");
const statusupdate = require("./Controllers/statusupdate");

const app = express();
app.use(express.json());
// database connection
const dbURI =
  "mongodb+srv://chirudeep:lcnxQdeaze9lLafw@cluster0.mdo5w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const dbURI =
//   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
//middleware function that processes jwt
const authMiddleware = (req, res, next) => {
  //jsonweb token has to be sent in Authorization header field. else, redirect to login page
  if (!req.header("Authorization")) {
    res.redirect("/auth/login");
    return;
  }
  jwt.verify(
    req.header("Authorization"),
    "secret hash key",
    (err, decodedtoken) => {
      if (err) {
        res.redirect("/auth/login");
        return;
      }
      //jwt has {id,type}. id corresponds to _id of user
      req.body.id = decodedtoken.id;
      req.body.type = decodedtoken.type;

      next();
    }
  );
};

app.use("/auth", userAuth);

//All the below endpoints should have jwt sent in Authorization field in header

// frontend code should send id of each item and its quantity
// now a location is randomly chosen for each item , customer id and status are set appropriately
// example of a input from frontend
// {
//     "items":[{"_id":"61c98bec43a8f50fd26d40ac","quantity":40},{"_id":"61c98b8443a8f50fd26d40aa","quantity":67}]
// }
app.post("/orders", authMiddleware, order_processing);
// example input in body of request:
// {
//     "status":"Reached Store"
// }
app.get("/orders_by_status", authMiddleware, orderlist_status);
//no input in request body is needed
app.get("/orders", authMiddleware, orderlist);
//no input in request body is needed
app.get("/drivers", authMiddleware, drivers);
// example input in body:
// {
//     "delivery_id":"61cc32fd69645cfa26696f89",
//     "order_id":"61cc36624a090e6fd3b3f859"
// }
app.patch("/assigndriver", authMiddleware, assigndriver);
// example input in body of request:
// {
//     "order_id":"61cc36624a090e3f859",
//     "status":"Enroute"
// }
app.patch("/statusupdate", authMiddleware, statusupdate);
