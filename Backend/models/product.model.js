const mongoose = require("mongoose");


const reviewSchema= new mongoose.Schema({
    rating:{
        type:Number
    },
    comment:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
})

const Review = mongoose.model("Review", reviewSchema);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true,
    },
    description: {
      type: String,
      required: true,
    },
    category:{
      type:String
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default:(Math.random()*5).toFixed(1),
      min: 0,
      max: 5,
    },
    brand: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    variations: [
      {
        size: {
          type: String,
        },
        colors: [
          {
            color: {
              type: String,
              required: true,
            },
            colorCode: {
              type: String,
              required: true,
            },
            stock: {
              type: Number,
              default: 0,
              min: 0,
            },
          },
        ],
      },
    ],
    stock:{
      type:Number,
      default:0
    },
    reviews: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
      },

    ],
  },
  { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);
module.exports = Product
