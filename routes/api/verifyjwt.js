const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const router = express.Router();

//Token verification middleware
//verifyToken();

router.post("/", (req, res) => {
  //Get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if(typeof bearerHeader != 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(" ");
    //Get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    console.log("Token being attempted: " + bearerToken);

    jwt.verify(req.token, process.env.SECRET_JWT_KEY, (err, authData) => {
      if (err){
        console.log("Error!!!!!")
        return res.status(401).json({ errorMsg: "The JWT was invalid."});
      };
      console.log("This token is genuine: " + JSON.stringify(authData));
      req.user_id = authData.user_id;
      return res.sendStatus(200);
    });
  } else {
    //There is no bearer token present
    //send an error that will trigger redirect to login page
    return res.status(401).json({ errorMsg: "The JWT was invalid."});
  }
});


module.exports = router;
