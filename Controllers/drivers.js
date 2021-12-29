const Users = require("../Models/users");
module.exports = async (req, res) => {
  let result_doc = await Users.findById(req.body.id);

  //only admin can get list of drivers
  if (!result_doc) {
    res.send("you are not authorized");
    return;
  }
  if (result_doc.type != "admin") {
    res.send("you are not authorised");
    return;
  }
  let driverslist = await Users.find({ type: "delivery" });
  res.json({ driverslist });
};
