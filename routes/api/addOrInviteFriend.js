const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { conn } = require("../../utils/dbconnect.js");
const router = express.Router();

const { verifyToken } = require("./verifyjwtmiddleware.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

function isPhoneNumber(phoneNumOrEmail){
  let phoneNumRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  if(phoneNumRegex.test(phoneNumOrEmail)){
    return true;
  }

  return false;
}

router.post('/', verifyToken, (req, res) => {
  let emailOrPhoneNumber = req.body.emailOrPhoneNumber;
  console.log(req.body.emailOrPhoneNumber);
  var sql = "SELECT user_id, profile_image_key FROM users WHERE email = ? OR phone_number = ?";
  conn.query(sql, [emailOrPhoneNumber, emailOrPhoneNumber], function(err, results, fields){
    if (err) throw err;
    if(results.length > 0){
      let user_id = results[0].user_id;
      let profile_image_key = results[0].profile_image_key;
      return res.json({ wasUserFound: true, email: null, phoneNumber: null, userId: user_id, profileImageKey: profile_image_key });
    } else {
      let phone_number = null;
      let email = null;
      if(isPhoneNumber(emailOrPhoneNumber)){
         phone_number = emailOrPhoneNumber;
      } else {
        email = emailOrPhoneNumber;
      }
      return res.json({ wasUserFound: false, email: email, phoneNumber: phone_number, userId: null, profileImageKey: "placeholder.png" });
    }
  });
});

module.exports = router;
