const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { conn } = require("./dbconnect.js");
const { checkIfPhoneNumberExists, checkIfEmailExists } = require("./phoneNumberAndEmailCheck.js");
const { validateRegistrationInfo } = require("./validateRegistrationInfo.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



router.post("/", async(req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    const reconfirmPassword = req.body.reconfirmPassword;

    let validate = await validateRegistrationInfo(first_name, last_name, email, phone_number, password, reconfirmPassword);

    if(validate.success == false){
      return res.json(validate);
    }

    //All inputs have been successfully sanitized and validated, can now proceed to input data to db
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    //Generate user_id UUID
    let user_id_uuid = uuidv4();

    const userInfo = [
      [user_id_uuid, first_name, last_name, phone_number, email, encryptedPassword]
    ];

    var sql = "INSERT INTO users (user_id, first_name, last_name, phone_number, email, password) VALUES ?";
    conn.query(sql, [userInfo], function (err, result) {
      if (err) throw err;
      return res.json({ success: true, msg: "You have successfully signed up for an acct!" });
    });

});

module.exports = router;
