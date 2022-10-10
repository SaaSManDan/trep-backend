const { conn } = require("./dbconnect.js");


function checkIfEmailExists(email){
  return new Promise((resolve, reject) => {
      var sql = "SELECT COUNT(email) FROM users WHERE email = ?";
      conn.query(sql, email, function (err, result, fields) {
      if (err) throw err;

      const numOfRows = JSON.stringify(result[0]["COUNT(email)"]);
      //console.log("Number of users with this email: " + numOfRows);
      if(numOfRows > 0){
        console.log("There is an existing user with this email.");
        resolve(true);
      }
      resolve(false);
    });
  })
}


function checkIfPhoneNumberExists(phone_number){
  return new Promise((resolve, reject) => {
      var sql = "SELECT COUNT(phone_number) FROM users WHERE phone_number = ?";
      conn.query(sql, phone_number, function (err, result, fields) {
      if (err) throw err;

      const numOfRows = JSON.stringify(result[0]["COUNT(phone_number)"]);
      //console.log("Number of users with this phone number: " + numOfRows);
      if(numOfRows > 0){
        console.log("There is an existing user with this phone number.");
        resolve(true);
      }
      resolve(false);
    });
  })
}

module.exports = { checkIfPhoneNumberExists, checkIfEmailExists };
