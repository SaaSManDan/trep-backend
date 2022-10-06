const { checkIfPhoneNumberExists, checkIfEmailExists } = require("./phoneNumberAndEmailCheck.js");

async function validateRegistrationInfo(first_name, last_name, email, phone_number, password, reconfirmPass) {
  if(first_name.trim().length === 0){
    return { success: false, msg: "Please enter your first name." };
  }

  const lettersOnlyPattern = /^[a-zA-Z-]+$/;
  if(!lettersOnlyPattern.test(first_name)){
    return { success: false, msg: "First name is not in the proper format." };
  }

  if(last_name.trim().length === 0){
    return { success: false, msg: "Please enter your last name." };
  }

  if(!lettersOnlyPattern.test(last_name)){
    return { success: false, msg: "Last name is not in the proper format." };
  }

  if(password.trim().length === 0){
    return { success: false, msg: "Please enter a password." };
  }

  if(reconfirmPass.trim().length === 0){
    return { success: false, msg: "Please enter reconfirmed password." };
  }

  if(password.trim().length < 6){
    return { success: false, msg: "Password must be at least 6 characters." };
  }

  const passwordCriteria = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
  if(!passwordCriteria.test(password)){
    return { success: false, msg: "The password is not in the proper format." };
  }

  if(password != reconfirmPass){
    return { success: false, msg: "Password and reconfirmed password do not match." };
  }

  if(email.trim().length === 0 && phone_number.trim().length === 0) {
    return { success: false, msg: "Phone number and email fields were left blank." };
  } else if(email.trim().length === 0){ //presume user entered phone number instead of email
    const phoneNumCriteria = /^[0-9]*$/;
    if(!phoneNumCriteria.test(phone_number)){
      return { success: false, msg: "Phone number format is invalid." };
    }
    if(await checkIfPhoneNumberExists(phone_number)){
      return { success: false, msg: "This phone number is already in use." };
    }
  } else if (phone_number.trim().length === 0) { //presume user entered email instead of phone #
    const emailCriteria = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailCriteria.test(email)){
      return { success: false, msg: "Email format is invalid." };
    }
    //checks if email already exists
    if(await checkIfEmailExists(email)){
      return { success: false, msg: "This email is already in use." };
    }
  }

  return { success: true };
}

module.exports = { validateRegistrationInfo };
