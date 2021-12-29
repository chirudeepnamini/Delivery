const mongoose = require("mongoose");
const catalogueSchema = new mongoose.Schema({
  name: String,
  category: String,
  locations: [String],
});
module.exports = mongoose.model("Catalogue", catalogueSchema);
