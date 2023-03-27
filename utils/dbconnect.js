require('dotenv').config()
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("[Dev Environment] Successfully connected to the Trep database!");
});

module.exports = { conn };
