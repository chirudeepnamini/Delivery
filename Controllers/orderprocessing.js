const Catalogue = require("../Models/catalogue");
const Orders = require("../Models/orders");
//

const order_processing = async (req, res) => {
  const { items } = req.body;

  const id_list = items.map((item) => item._id);
  //get a list of items from catalogue of ids from request
  const results = await Catalogue.find({ _id: { $in: id_list } });
  let items_list = [];
  results.forEach((doc) => {
    items.forEach((item) => {
      if (item._id == doc._id) {
        let obj = {};
        obj._id = doc._id;
        //for each item, select a random location from its list of locations
        obj.pickup =
          doc.locations[Math.floor(Math.random() * doc.locations.length)];
        obj.quantity = item.quantity;

        items_list.push(obj);
      }
    });
  });
  //prepare the document to be inserted in Orders collection
  const insert_doc = new Orders({
    items: items_list,
    customer_id: req.body.id,
    status: "Task created",
  });
  //save it to the collection
  insert_doc
    .save()
    .then((order) => {
      //return it to user(some improvements need to be done on what data we should send)
      res.json({ order });
    })
    .catch((error) => {
      res.json({ error });
    });
};
module.exports = order_processing;
