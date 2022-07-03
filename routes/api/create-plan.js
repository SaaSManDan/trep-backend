const express = require("express");
const validator = require("validator");
const app = express();
const bodyParser = require("body-parser");
const { conn } = require("./dbconnect.js");

const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

router.post("/", async(req, res) => {
  const name_of_plan = req.body.name_of_plan;
  const head_planner_id = req.body.head_planner_id;
  const trip_start_date = req.body.trip_start_date;
  const trip_end_date = req.body.trip_end_date;
  const location = req.body.location;
  const notes = req.body.notes;

  const plan_info = [
    [name_of_plan, head_planner_id, trip_start_date, trip_end_date, location, notes]
  ];

  var sql = "INSERT INTO plans (name_of_plan, head_planner_id, trip_start_date, trip_end_date, location, notes) VALUES ?";
  conn.query(sql, [plan_info], function (err, results) {
    if (err) throw err;
      console.log("This plan's id is: " + results.insertId + " and your user id is: " + head_planner_id);

      
      const uwp_info = [
        [head_planner_id, results.insertId]
      ];
      var insertUWPSql = "INSERT INTO users_with_plans (user_id, plan_id) VALUES ?";
      conn.query(insertUWPSql, [uwp_info], function (err, insertUWP_results) {
        if (err) throw err;

      });


      return res.send("You have successfully created a new travel plan!");
    });


});

module.exports = router;
