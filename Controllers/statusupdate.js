const orders = require("../Models/orders");
const users = require("../Models/users");

module.exports = async (req, res) => {
  let result_doc = await users.findById(req.body.id);
  if (!result_doc) {
    res.send("no such user exist");
  }
  if (result_doc.type != "delivery") {
    res.send("you are not authorised");
    return;
  }
  if (!req.body.status || !req.body.order_id) {
    res.send("required info not provided");
  }
  let status = req.body.status;
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
  let result;
  try {
    //we are updating the delivery_id field of a Order
    result = await orders.findOneAndUpdate(req.body.order_id, {
      status: req.body.status,
    });
  } catch (error) {
    res.json({ error });
  }
  res.json({ result });
  return;
};
