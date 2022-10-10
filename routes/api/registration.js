const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { conn } = require("../../utils/dbconnect.js");
const { checkIfPhoneNumberExists, checkIfEmailExists } = require("../../utils/phoneNumberAndEmailCheck.js");
const { validateRegistrationInfo } = require("../../utils/validateRegistrationInfo.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const multer = require('multer')
const upload = multer({ dest: 'images/',
                        fileFilter: (req, file, cb) => {
                            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/heic") {
                              cb(null, true);
                            } else {
                              req.fileValidationError = "Invalid Image File";
                              return cb(null, false, req.fileValidationError);
                            }
                          }
                        });

const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const { uploadFile } = require('../../utils/s3')

router.post("/", upload.single('image'), async(req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    const reconfirmPassword = req.body.reconfirmPassword;
    var profile_image_key = ""

    console.log("First Name: " + first_name);
    console.log("Last Name: " + last_name);
    console.log("Email: " + email);
    console.log("Phone number: " + phone_number);
    console.log("Password: " + password);
    console.log("Reconfirm pass: " + reconfirmPassword);

    let validate = await validateRegistrationInfo(first_name || '', last_name || '', email || '', phone_number || '', password || '', reconfirmPassword || '');

    if(validate.success == false){
      return res.json(validate);
    }

    const file = req.file
    if (req.fileValidationError) {
      return res.json({ success: false, msg: req.fileValidationError });
    } else if(!file){
      profile_image_key = "placeholder.png" //default image
    } else {
      const uploadedProfileImageResult = await uploadFile(file)
      profile_image_key = uploadedProfileImageResult.key
    }


    //All inputs have been successfully sanitized and validated, can now proceed to input data to db
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    //Generate user_id UUID
    let user_id_uuid = uuidv4();

    const userInfo = [
      [user_id_uuid, first_name, last_name, phone_number, email, encryptedPassword, profile_image_key]
    ];

    var sql = "INSERT INTO users (user_id, first_name, last_name, phone_number, email, password, profile_image_key) VALUES ?";
    conn.query(sql, [userInfo], function (err, result) {
      if (err) throw err;
      return res.json({ success: true, msg: "You have successfully signed up for an acct!" });
    });

});

module.exports = router;
