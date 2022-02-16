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

const PORT = process.env.PORT || 3000;

app.listen(PORT);
