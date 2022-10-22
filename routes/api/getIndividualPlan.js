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
  let plan_id = req.query.plan_id;
  var sql = "SELECT plan_id, plan_name, trip_start_date, trip_end_date, location FROM plans WHERE plan_id = ?";
  conn.query(sql, plan_id, function(err, results){
    if (err) throw err;
    if(results.length > 0){
      console.log(results);
      return res.json(results);
    }
  });
});

module.exports = router;
