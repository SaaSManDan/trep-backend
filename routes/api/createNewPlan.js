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

async function insertIntoUsersWithPlansTable(arrayOfUserIds, plan_id){
  let uwp_objs = [];
  for(var user_id of arrayOfUserIds){
    let uwp_id = uuidv4();
    let current_time = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');

    uwp_objs.push([ uwp_id, user_id, plan_id, current_time]);
  }
  var sql = "INSERT INTO users_with_plans(users_with_plans_id, user_id, part_of_plan_id, date_joined) VALUES ?";
  conn.query(sql, [uwp_objs], function(err, results, fields){
    if (err) throw err;
    if(results.affectedRows > 0){
      console.log("Friends successfully added to plan");
      return;
    }
  });
}

router.post('/', verifyToken, (req, res) => {
  let plan_id = uuidv4();
  let creator_user_id = req.body.creator_user_id;
  let plan_name = req.body.plan_name;
  let trip_start_date = req.body.trip_start_date;
  let trip_end_date = req.body.trip_end_date;
  let location = req.body.location;
  let notes = req.body.notes;
  let arrayOfUserIdsToBeAdded = req.body.arrayOfUserIdsToBeAdded;

  var sql = "INSERT INTO plans(plan_id, creator_user_id, plan_name, trip_start_date, trip_end_date, location, notes) VALUES (?, ?, ?, ?, ?, ? ,?)";
  conn.query(sql, [plan_id, creator_user_id, plan_name, trip_start_date, trip_end_date, location, notes], async function(err, results){
    if (err) throw err;
    console.log("Plan successfully created.");
    console.log("Result length: " + results.affectedRows);
    if(results.affectedRows > 0){ //if plan successfully added into db
      if(arrayOfUserIdsToBeAdded.length > 0){
          await insertIntoUsersWithPlansTable(arrayOfUserIdsToBeAdded, plan_id);
      }
      console.log("Plan Id: " + plan_id);
      return res.json({ success: true, planId: plan_id });
    } else {
      return res.json({ success: false, planId: null });
    }
  });
});

module.exports = router;
