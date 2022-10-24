const express = require("express");

const app = express();

const logger = (req, res, next) => {
  console.log(req.protocol + "://" + req.get('host') + req.originalUrl);
  next();
}

//Init middleware
app.use(logger);

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended : false }));


app.get('/', function(req, res){
  res.send("Welcome to Trep's API Backend!");
  //Leave blank since we are only using this application for APIs
});

app.use("/api/register/", require("./routes/api/registration"));
app.use("/api/login/", require("./routes/api/login"));
app.use("/api/verifyjwt/", require("./routes/api/verifyjwt"));
app.use("/imageViewer/", require("./routes/api/imageViewer"));
app.use("/api/addOrInviteFriend/", require("./routes/api/addOrInviteFriend"));
app.use("/api/createNewPlan/", require("./routes/api/createNewPlan"));
app.use("/api/showAllPlans/", require("./routes/api/showAllPlans"));
app.use("/api/IndividualPlan/", require("./routes/api/IndividualPlan"));

const PORT = process.env.PORT || 8080;

app.listen(PORT);
