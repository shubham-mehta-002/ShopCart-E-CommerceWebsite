const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true, unique: true },
});

 
const Category = mongoose.model('Category', categorySchema);
module.exports = Category