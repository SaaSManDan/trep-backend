const express = require("express");
const jwt = require("jsonwebtoken");
const { conn } = require("./dbconnect.js");
const { verifyToken } = require("./verifyjwt.js");
const app = express();
const router = express.Router();

//Token verification middleware
//verifyToken();

router.get("/", verifyToken, (req, res) => {
  var sql = "SELECT * FROM users_with_plans as uwp RIGHT JOIN plans ON uwp.plan_id = plans.plan_id WHERE user_id = ?";
  conn.query(sql, req.user_id, async function (err, results, fields) {
    if (err) throw err;
    if(results.length > 0){
      return res.send(results);
    } else {
      return res.send("You currently do not have any upcoming plans.");
    }
  });

});


module.exports = router;
