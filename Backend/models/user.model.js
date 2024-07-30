const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate : {
        validator : (value) =>  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message:"Invalid email format"
      },
      trim:true
    },
    password: {
      type: String,
      required: true,
      validate : {
        validator : (value) =>  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]).{8,}$/.test(value),
        message: "Password must include at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long."
      },
      trim:true
    },
    fullName: {
      type: String,
      validate : {
        validator : (value) => /^[A-Za-z ]+$/.test(value),
        message: "Enter a valid name"
      },
      trime:true
    },
    phoneNumber: {
      type: String,
      validate : {
        validator : (value) =>/^[0-9]{10}$/.test(value),
        message: "Enter a valid 10 digit phone number"
      },
      trim:true
    },
    address: [
      {
        street: {
          type: String,
          required: true,
          validate : {
            validator : (value) => /^[A-Za-z0-9,#. ]+$/.test(value),
            message: "Enter a valid street Address"
          },
          trim:true
        },
        city: {
          type: String,
          required: true,
          validate : {
            validator : (value) =>/^[A-Za-z ]+$/.test(value),
            message: "Enter a valid city"
          },
          trim:true
        },
        state: {
          type: String,
          required: true,
          validate : {
            validator : (value) =>/^[A-Za-z ]+$/.test(value),
            message: "Enter a valid state"
          },
          trim:true
        },
        pinCode: {
          type: String,
          required: true,
          validate : {
            validator : (value) =>/^\d{6}$/.test(value),
            message: "Enter a valid pincode"
          },
          trim:true
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [{
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
        quantity:{
          type:Number,
          default:0,
          validate:{
            validator:(value)=>value>=0,
            message: "Quantity must be at least 0"
          }
          
        },
      color:{
        type:String,
        trim:true
      },
      colorCode:{
        type:String,
        trim:true
      },
      size:{
        type:String,
        trim:true
      }
    }],
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    refreshToken: {
      type: String,
    },
    role:{
      type:String,
      lowercase:true,
      enum:["user","admin"],
      default:"user"
    },
    resetPasswordToken : {
      type:String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      email: this.email,
      userId: this._id,
      role : this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
  return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
  return refreshToken;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
