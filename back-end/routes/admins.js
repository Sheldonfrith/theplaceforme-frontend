var express = require("express");
var router = express.Router();
const fs = require("fs");
let rawData = fs.readFileSync("admin-key.json");
let adminKey = JSON.parse(rawData);
var firebase = require("../lib/FirebaseService");

//create new admin with admin-key/token
router.post("/", function (req, res, next) {
  const asyncWrapper = async () => {
    console.log("post request to admins");
    const body = await req.body;
    if (body[0] === await adminKey[0]) {
      // make the current user an admin
      const currentUserID = body[1];
      console.log(currentUserID);
      await firebase
        .auth()
        .setCustomUserClaims(currentUserID, {
          admin: true,
        }).then(()=>{
            console.log('made the user an admin');
        })
    } else {
        console.log('admin key did not match',body[0]);
    }

    res.type("text");
    res.send("tried to make an admin");
  };
  asyncWrapper();
});

module.exports = router;
