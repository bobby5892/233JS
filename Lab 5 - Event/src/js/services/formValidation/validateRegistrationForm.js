// Notice the export statement and the import in home.js
// Notice the structure of the parameter and the return value
export default function validateRegistrationForm(formValues) {


  const result = {
    username: validateUserName(formValues.username),
    email: validateEmail(formValues.email),
    phone: validatePhone(formValues.phone),
    age: validateAge(formValues.age),
    profession: validateProfession(formValues.profession),
    experience: validateExperience(formValues.experience),
  };

  let field, isValid = true;
  for(field in result) {
    isValid = isValid && result[field];
  }

console.log("Form is " + isValid + " results" + result);
  return {
    isValid,
    result,
  };

}

/* Part 1 - Regular expressions 
   Write each of the functions below using a regular expression
   to do the actual validation whenever possible.  
   
   You can write the expressions yourself or find one on the internet.  
   
   You might test your regular expressions
   in the html page I gave you OR you might create a codepen or jsfiddle
   playground to test your functions as you write them.

   The function above calls all of these functions.  You're ready to add 
   validation to home.js.
*/

// must be longer than 3 chars.  Use a regular expression.
function validateUserName(name) {
  let regExp =  /\w{3,}/;
  return regExp.test(name); ;
}

// must be a valid email address.  Use a regular expression
function validateEmail(email) {
  /* http://emailregexp.com */
  let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
}

// must be a valid 10 digit phone number.  Use a regular expression
function validatePhone(phone) {
  let regExp = /\d{10,}/;
  return regExp.test(phone);
}

// must be between 10 and 25 inclusive.  Use a regular expression
// to make sure that the age is a 2 digit number before checking the range.
function validateAge(age) {
  let regExp = /\d{2}/;
  return ((regExp.test(age)) && (age >= 10) && (age <= 25))
}

// must be either school, college, trainee or employee.  No reg exp.
function validateProfession(profession) {
  let validResponses = ['school', 'college','trainee','employee'];
  for(let prof in validResponses){
    if(profession == validResponses[prof]){
      return true;
    }
  }
  return false;
}

// must be between 0 and 4 years exclusive.  Use a regular expression.
function validateExperience(experience) {
  let regExp = /\d{1}/;
  return ( (regExp.test(experience)) && (experience > 0) && (experience < 4) );
}
