const Users = require("../Models/users");
const Orders = require("../Models/orders");

const orderlist_status = async (req, res) => {
  //check if the page is visited by admin
  let result_doc = await Users.findById(req.body.id);
  if (!result_doc) {
    res.send("you are not authorized");
    return;
  }
  if (result_doc.type != "admin") {
    res.send("you are not authorised");
    return;
  }
  let status = req.body.status;
  if (!status) {
    res.send("status info not provided");
    return;
  }
  if (
    status != "Task Created" &&
    status != "Reached Store" &&
    status != "Items Picked" &&
    status != "Enroute" &&
    status != "Delivered" &&
    status != "Cancelled"
  ) {
    res.send("wrong status info");
    return;
  }
  let result = await Orders.find({ status });

  res.json({ result });
  return;
};

const orderlist = async (req, res) => {
  //check if the page is visited by admin
  let result_doc = await Users.findById(req.body.id);
  if (!result_doc) {
    res.send("you are not authorized");
    return;
  }
  if (result_doc.type != "delivery" && result_doc.type != "admin") {
    res.send("you are not authorised");
    return;
  }
  let result = await Orders.find();

  res.json({ result });
  return;
};

module.exports = { orderlist_status, orderlist };
