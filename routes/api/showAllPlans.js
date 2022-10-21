const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { conn } = require("../../utils/dbconnect.js");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { verifyToken } = require("./verifyjwtmiddleware.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


router.get('/', verifyToken, (req, res) => {
  let user_id = req.query.user_id;
  var sql = "SELECT plans.plan_id, plans.plan_name, plans.trip_start_date, plans.trip_end_date, plans.location FROM plans INNER JOIN users_with_plans ON users_with_plans.part_of_plan_id = plans.plan_id WHERE users_with_plans.user_id = ? ORDER BY plans.trip_start_date DESC";
  conn.query(sql, user_id, function(err, results){
    if (err) throw err;
    if(results.length > 0){
      console.log(results);
      return res.json(results);
    }
  });
});

module.exports = router;
