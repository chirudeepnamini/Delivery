const Orders = require("../Models/orders");
const Users = require("../Models/users");

module.exports = async (req, res) => {
  //only admin can assign driver to a order
  let result_doc = await Users.findById(req.body.id);
  if (result_doc.type != "admin") {
    res.send("you are not authorised");
    return;
  }
  //admin need to send order id and id of delivery person
  if (!req.body.order_id || !req.body.delivery_id) {
    res.send("incomplete info provided");
    return;
  }
  let result;
  try {
    //we are updating the delivery_id field of a Order
    result = await Orders.findByIdAndUpdate(req.body.order_id, {
      delivery_id: req.body.delivery_id,
    });
  } catch (error) {
    res.json({ error });
  }
  res.json({ result });
  return;
};
