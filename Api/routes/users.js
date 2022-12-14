const express = require("express");
const multer = require("multer");
const router = express.Router();
const users = require("../model/users");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const dotenv = require("dotenv").config();

// //////register
// router.post("/register", function (req, res) {
//   let cipher = crypto.createCipher("aes-256-ctr", req.body.password);
//   let crypted = cipher.update(req.body.password, "utf-8", "hex");
//   crypted += cipher.final("hex");
//   let x = req.body;
//   x.password = crypted;
//   users.create(x, function (err, data) {
//     if (err) {
//       console.log("Error!!!!!!!!!!!");
//       res.send(err);
//       res.end();
//     } else {
//       let secret = process.env.TOKEN_SECRET;
//       let token = jwt.sign(data.email, secret);
//       res.setHeader("authorization", token);
//       console.log(token);
//       res.send(token);
//     }
//   });
// });

//////register mobile
router.post("/register", function (req, res) {
  let cipher = crypto.createCipher("aes-256-ctr", req.body.password);
  let crypted = cipher.update(req.body.password, "utf-8", "hex");
  crypted += cipher.final("hex");
  let x = req.body;
  x.password = crypted;
  users.create(x, function (err, data) {
    if (err) {
      console.log("Error!!!!!!!!!!!");
      res.send("failed");
      // res.end();
    } else {
      let secret = process.env.TOKEN_SECRET;
      // let token = jwt.sign(data.email, secret);
      res.setHeader("authorization", "token");
      // console.log(token);
      res.send("success");
    }
  });
});
//////Login mobile
router.post("/login", function (req, res) {
  console.log(req.body);
  let decipher = crypto.createDecipher("aes-256-ctr", req.body.password);
  let decrypted = decipher.update(req.body.password, "utf-8", "hex");
  decrypted += decipher.final("hex");
  let x = req.body;
  x.password = decrypted;
  if (!req.headers.authorization) {
    users
      .findOne({ $and: [{ email: req.body.email }, { password: x.password }] })
      .then((err, data) => {
        if (!err) res.send("failed");
        else {
          let secret = process.env.TOKEN_SECRET;
          // let token = jwt.sign(data.email, secret);
          res.setHeader("authorization", "token");
          res.send("success");
        }
      });
  } else {
    let tokn = req.headers.authorization;
    let secret = process.env.TOKEN_SECRET;
    let detoken = jwt.verify(tokn, secret);
    if (req.body.email == detoken) {
      console.log("token succeeded!!!");
      res.send("token succeeded!!!");
    } else {
      console.log("token failed!!!!!!!!!!");
      res.send("token failed!!!!!!!!!!");
    }
  }
});

//get user mobile
//Update User from addtocart page
router.get("/getUser/:email", function (req, res) {
  users.findOne({ email: req.params.email }).then((data, err) => {
    console.log(data);
    if (data) res.send(data);
    else res.send("failed");
  });
});

// //////Login
// router.post("/login", function (req, res) {
//   console.log(req.body);
//   res.send("success");
//   let decipher = crypto.createDecipher("aes-256-ctr", req.body.password)
//   let decrypted = decipher.update(req.body.password, "utf-8", "hex")
//   decrypted += decipher.final("hex")
//   let x = req.body
//   x.password = decrypted
//   if (!req.headers.authorization) {
//       users.findOne({ $and: [{ email: req.body.email }, { password: x.password }] }).then((err, data) => {
//           if (!err)
//               res.send("err");
//           else{
//               let secret = process.env.TOKEN_SECRET;
//               let token = jwt.sign(data.email, secret);
//               res.setHeader("authorization", token)
//               res.send("logged in successfully")}
//       })
//   }
//   else {
//       let tokn = req.headers.authorization;
//       let secret = process.env.TOKEN_SECRET;
//       let detoken = jwt.verify(tokn, secret)
//       if (req.body.email == detoken) {
//           console.log("token succeeded!!!")
//           res.send("token succeeded!!!")
//       }
//       else {
//           console.log("token failed!!!!!!!!!!")
//           res.send("token failed!!!!!!!!!!")
//       }
//   }
// });

//Update User from addtocart page
router.post("/confirm/:id", function (req, res) {
  users
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        phone_number: Number(req.body.phone),
        address: { st: req.body.address },
      }
    )
    .then((err, data) => {
      if (!err) res.send("ERR!!");
      else res.send("Updated!");
    });
});
//Delete item from cart
router.post("/removefromcart/:id/:idp", function (req, res) {
  users.findOne({ _id: req.params.id }).then((data, err) => {
    if (err) res.send("ERRRRRR!!!!!");
    else {
      data.cart.remove(req.params.idp);
      data.save();
      res.send("sssss");
    }
  });
});
//Add item to cart from product page
router.post("/addtocart/:id/:idp", function (req, res) {
  users.findOne({ _id: req.params.id }).then((data, err) => {
    if (err) {
      console.log(req.err);
      res.send("ERRRRRR");
    } else {
      data.cart.push(req.params.idp);
      data.save();
      res.send("sssss");
    }
  });
});

//////////////////////////get user///////////////////////////////////
router.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await users.findById(id);
    res.send(user);
  } catch (err) {
    res.send("something went wrong");
  }
});

//////////////////////////update user info///////////////////////////////////
router.patch("/updateUser/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    const user = await users.findByIdAndUpdate(id, body);
    res.send(user);
  } catch (err) {
    res.send("something went wrong");
  }
});

//////////////////////////add to wishlist///////////////////////////////////
router.post("/wishlist/:id", async (req, res) => {
  console.log(req.body);

  await users.findByIdAndUpdate(req.params.id, {
    $push: { wishlist: req.body.title },
  });
  res.send("done");
});

/////////////////////////delete from wishlist/////////////////////////////
router.delete("/wishlist/:id", async (req, res) => {
  const title = req.body.title;
  console.log(req.body);
  const user = await users.findById(req.params.id);
  let wishlist = user.wishlist;
  wishlist = wishlist.filter((item) => {
    return item !== title;
  });
  await users.findByIdAndUpdate(req.params.id, { wishlist });
  res.send("done");
});
/////////////////////////get from wishlist/////////////////////////////

router.get("/wishlist/:id", async (req, res) => {
  const user = await users.findById(req.params.id);

  res.send(user.wishlist);
});

///////////////////////////get userAds./////////////////////////////////
router.get("/ads/:id", async (req, res) => {
  let prodList = [];
  users
    .findById(req.params.id)
    .then(async (user) => {
      for (let i = 0; i < user.ads.length; i++) {
        let p = await products.findOne({ _id: user.ads[i] });
        prodList.push(p);
      }
      res.send(prodList);
    })
    .catch((err) => console.log("failed"));
});

/////////////////// delete ads ////////////////////////

router.delete("/ads/:id/:itemId", async (req, res) => {
  console.log("ssssssssss");
  const { id, itemId } = req.params;
  const user = await users.findById(id);
  let ads = user.ads;
  console.log(ads);
  ads = ads.filter((objectId) => {
    return objectId.toString() !== itemId;
  });
  await users.findByIdAndUpdate(id, { ads });
  await products.findByIdAndDelete({ _id: itemId });
  res.send("done");
});

//Get cart items
router.get("/cartitems/:id", async function (req, res) {
  let itms = [];
  let arrr = [];
  await users.findById({ _id: req.params.id }, {}).then((data, err) => {
    itms = [...data.cart];
  });
  await Promise.all(
    itms.map(async (item, index) => {
      await product.find({ _id: item }, {}).then((dt, er) => {
        arrr.push(dt[0]);
      });
    })
  );
  res.send(arrr);
});

module.exports = router;
