const mongoose = require("mongoose");

const userCollection = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    wishlist: [
      {
        type: String,
      },
    ],
    ads: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],
    address: [
      {
        blockNumber: Number,
        st: String,
        city: String,
        area: String,
      },
    ],
    // paymentCredit: [
    //   {
    //     type: Number,
    //     unique: true,
    //   },
    // ],
    time: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  },
  {
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model("userCollection", userCollection);
