const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [
    {
      catalogue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catalogue",
      },
      pickup: String,
      quantity: Number,
    },
  ],
  status: String,
  delivery_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});
module.exports = mongoose.model("Orders", orderSchema);
