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

router.get('/listOfUsersOnPlan', verifyToken, (req, res) => {
  let user_id = req.query.user_id;
  let plan_id = req.query.plan_id;
  var sql = "SELECT user_id from users_with_plans WHERE part_of_plan_id=? AND NOT user_id=?";
  conn.query(sql, [plan_id, user_id], function(err, results){
    if (err) throw err;
    if(results.length > 0){
      console.log(results);
      return res.json(results);
    } else {
      return res.json([{ user_id: null }])
    }
  });
});

router.get('/getNumberOfUsersOnPlan', verifyToken, (req, res) => {
  let user_id = req.query.user_id;
  let plan_id = req.query.plan_id;
  var sql = "SELECT count(user_id) as numberOfUsersOnPlan from users_with_plans WHERE part_of_plan_id=? AND NOT user_id=?";
  conn.query(sql, [plan_id, user_id], function(err, results){
    if (err) throw err;
    if(results.length > 0){
      console.log(results);
      return res.json(results);
    } else {
      return res.json([{ user_id: null }])
    }
  });
});

router.put('/', verifyToken, (req, res) => {
  let plan_id = req.query.plan_id;
  let plan_name = req.body.plan_name;
  let trip_start_date = req.body.trip_start_date;
  let trip_end_date = req.body.trip_end_date;
  let location = req.body.location;
  var sql = "UPDATE plans SET plan_name = ?, trip_start_date = ?, trip_end_date = ?, location = ? WHERE plan_id = ?";
  conn.query(sql, [plan_name, trip_start_date, trip_end_date, location, plan_id], function(err, results){
    if (err) throw err;
    console.log(results);
    return res.json(results);
  });
});

module.exports = router;
