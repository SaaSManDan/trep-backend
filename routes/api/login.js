const express = require("express");
const jwt = require("jsonwebtoken");
const { conn } = require("./dbconnect.js");
const bcrypt = require("bcrypt");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Token verification middleware


router.get("/", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;

  var sql = "SELECT user_id, password FROM users WHERE username = ? OR email = ?";
  conn.query(sql, [usernameOrEmail, usernameOrEmail], async function (err, results, fields) {
    if (err) throw err;
    if(results.length > 0){
      hashedPass = results[0].password;
      console.log(results);
      const match = await bcrypt.compareSync(password, hashedPass);
      if(match){
        const user_id = results[0].user_id;
        var token = jwt.sign({ user_id : user_id }, 'secretkey');
        console.log(token);
        return res.send("Your password was correct, you have successfully logged in!");
      }
    }
    return res.send("These login details are incorrect, try again.");
  });

});


module.exports = router;
