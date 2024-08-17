const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
  label: { type: String, required: true, unique: true },
});


const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand