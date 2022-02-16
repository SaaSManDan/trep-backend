const { conn } = require("./dbconnect.js");

function checkIfUsernameExists(username){
  return new Promise((resolve, reject) => {
      var sql = "SELECT COUNT(username) FROM users WHERE username = ?";
      conn.query(sql, username, function (err, result, fields) {
      if (err) throw err;

      const numOfRows = JSON.stringify(result[0]["COUNT(username)"]);
      console.log("Number of users with this username: " + numOfRows);
      if(numOfRows > 0){
        console.log("There is an existing user with this username");
        resolve(true);
      }
      resolve(false);
    });
  })
}


function checkIfEmailExists(email){
  return new Promise((resolve, reject) => {
      var sql = "SELECT COUNT(email) FROM users WHERE email = ?";
      conn.query(sql, email, function (err, result, fields) {
      if (err) throw err;

      const numOfRows = JSON.stringify(result[0]["COUNT(email)"]);
      console.log("Number of users with this email: " + numOfRows);
      if(numOfRows > 0){
        console.log("There is an existing user with this email.");
        resolve(true);
      }
      resolve(false);
    });
  })
}

module.exports = { checkIfUsernameExists, checkIfEmailExists };
