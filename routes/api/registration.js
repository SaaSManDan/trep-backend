const express = require("express");
const validator = require("validator");
const app = express();
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const { conn } = require("./dbconnect.js");
const { checkIfUsernameExists, checkIfEmailExists } = require("./usernameAndEmailCheck.js");
const bcrypt = require("bcrypt");

const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const validationArr = [
  //check to make sure inputs arent empty
  check("username").notEmpty().withMessage("Username field is empty."),
  check("email").notEmpty().withMessage("Email field is empty."),
  check("password").notEmpty().withMessage("Password field is empty."),
  check("reconfirmPassword").notEmpty().notEmpty().withMessage("Reconfirm password field is empty."),
  //ensures email is in proper format
  check("email").isEmail().withMessage("This email format is invalid."),
  //check username length
  check("username").isLength({min: 3, max: 15}).withMessage("Username is not the proper length."),
  //ensures username is in proper format: letters, numbers and underscores only
  check("username").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username is not in the proper format."),
  //ensures password is long enough
  check("password").isLength({min: 6}).withMessage("The password is too short"),
  //ensure password contains one uppercase, one lowercase, one digit and symbol
  check("password").matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/).withMessage("The password is not in the proper format."),
  //checks to make sure password and reconfirm password match
  //check("password").equals("reconfirmPassword").withMessage("The password and reconfirmed password do not match"),
]

function outputError(msg){
  return errorJson = {
    "errors" : [
      {
        "msg": msg
      }
    ]
  }
}


router.post("/", validationArr, async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const reconfirmPassword = req.body.reconfirmPassword;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors);
      return res.send(errors);
    }

    if(password != reconfirmPassword){
      return res.send(outputError("Password and reconfirm password do not match."));
    }

    //checks if username already exists
    if (await checkIfUsernameExists(username)){
      console.log("This if statement has been executed");
      return res.send(outputError("This username is already taken by an existing user."));
    }

    //checks if email already exists
    if (await checkIfEmailExists(email)){
      console.log("This if statement has been executed");
      return res.send(outputError("This email is already taken by an existing user."));
    }

    //All inputs have been successfully sanitized and validated, can now proceed to input data to db
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userInfo = [
      [username, email, encryptedPassword]
    ];

    var sql = "INSERT INTO users (username, email, password) VALUES ?";
    conn.query(sql, [userInfo], function (err, result) {
      if (err) throw err;
      return res.send("You have successfully signed up for an account!");
    });


});

module.exports = router;
