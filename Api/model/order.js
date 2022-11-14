const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
    // value
  },
  shipping: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    // required: true,
    default: "waiting",
    // waiting , on the way , delivered , canceled
  },
  addressfrom: {
    blockNumber: Number,
    st: String,
    city: String,
    area: String,
  },
  addressto: {
    blockNumber: Number,
    st: String,
    city: String,
    area: String,
  },
  time: {
    type: Date,
    default: Date.now(),
    // required: true,
  },
  paymentmethod: {
    type: String,
    required: true,
  },
  // cot , credit
  exchangable: {
    type: Boolean,
    // required: true,
    default: false,
  },
  exchangeProperties: {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      // required: true,
    },
    productPrice: {
      type: Number,
      // required: true,
    },
    profit: {
      type: Number,
      // required: true,
    },
    shipping: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      // required: true,
      // default: "waiting",
      // waiting , on the way , delivered , canceled
    },
    time: {
      type: Date,
      default: Date.now,
      // required: true,
    },
    paymentmethod: {
      type: String,
      // required: true,
    },
    // cot , credit
  },
});
module.exports = mongoose.model("orderCollection", orderSchema);