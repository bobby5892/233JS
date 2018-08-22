/* Event Handler by Robert Moore

7/31/2018

*/

import './general';

/* Part 1 - Check out the validation module in services/formValidation */
import validateRegistrationForm from './services/formValidation/validateRegistrationForm';
import apiCall from './services/api/apiCall';

import toastr from 'toastr';
import '../../node_modules/toastr/toastr.less';

class Home {
  constructor() {

    /* short hand ref */
    this.$form =       document.getElementById("registrationForm");
    this.$username =   document.getElementById("username");
    this.$email =      document.getElementById("email");
    this.$phone =      document.getElementById("phone");
    this.$age =        document.getElementById("age");
    this.$profession = document.getElementById("profession");
    this.$experience = document.getElementById("experience");
    this.$comment =    document.getElementById("comment");
    this.$submit =     document.getElementById("submit");
    this.$loadingIndicator = document.getElementById("loadingIndicator");

    this.registrationFormURL = "registration";
     /* on form submit pass to form handler function */
    this.$form.addEventListener("submit",(e) => {
      e.preventDefault();
    });

    this.$submit.addEventListener("click",e =>{
       // submitted via click since only partialy using setValidity in HTML5 

       // If we had included this in submit event - it would not occur during additional submits 
        this.onFormSubmit(e);
    });
  }

  /* from event handler - on submit */ 
  onFormSubmit(event) {
    let formValues = this.getFormValues();
    let {isValid, result} = validateRegistrationForm(formValues);
    console.log("validating form: " + isValid + " \n results: " + JSON.stringify(result));
    console.log("Form is coming back as " + isValid);
    if(isValid){
       this.clearErrors();
       this.submitForm(formValues);
    }
    else{
        this.clearErrors();
        this.highlightErrors(result);
    }
  }

 /* grab the form values in a known fashion */
  getFormValues() {
    return {
     username: this.$username.value,
      email: this.$email.value,
      phone: parseInt(this.$phone.value),
      age: this.$age.value,
      profession: this.$profession.value,
      experience: parseInt(document.querySelector('input[name="experience"]:checked').value),
      comment: this.$comment,
    };
  }
/* clear the form */
  resetForm() {
    this.$username.value = '';
    this.$email.value = '';
    this.$phone.value ='';
    this.$age.value = '';
    this.$experience.value ='';
    this.$comment.value = '';
    this.$profession.value = 'school';
    this.$experience.checked = true;
  }
/* add has-error class to elements that have error */
  highlightErrors(result) {
    if(!result.username) {
      this.$username.parentElement.classList.add('has-error');
      this.$username.setCustomValidity("Name must be more than 3 alphanumeric characters");
      this.$username.reportValidity();
    }
    if(!result.email) {
      this.$email.parentElement.classList.add('has-error');
      this.$email.setCustomValidity("Must be a valid Email Address");
      this.$email.reportValidity();
    }
    if(!result.phone) {
      this.$phone.parentElement.classList.add('has-error');
      this.$phone.setCustomValidity("Must be a 10 digit phone number");
      this.$phone.reportValidity();
    }
    if(!result.age) {
      this.$age.parentElement.classList.add('has-error');
      this.$age.setCustomValidity("Age must be between 10 and 25");
      this.$age.reportValidity();
    }
    if(!result.profession) {
      this.$profession.parentElement.classList.add('has-error');
      this.$profession.setCustomValidity("The profession you have chosen is not available at the event");
      this.$profession.reportValidity();
    }              
    if(!result.experience) {
      this.$experience.parentElement.classList.add('has-error');
      this.$experience.setCustomValidity("Experience you have selected is not available at the event");
      this.$experience.reportValidity();
    }                  
  }
  /* Remove class has-error from elements */
  clearErrors() {
        this.$username.parentElement.classList.remove('has-error');
        this.$email.parentElement.classList.remove('has-error');
        this.$phone.parentElement.classList.remove('has-error');
        this.$age.parentElement.classList.remove('has-error');
        this.$profession.parentElement.classList.remove('has-error');
        document.querySelector('input[name="experience"]:checked').parentElement.classList.remove('has-error');
        this.$comment.parentElement.classList.remove('has-error');
        
        this.$username.setCustomValidity("");
        this.$email.setCustomValidity("");
        this.$phone.setCustomValidity("");
        this.$age.setCustomValidity("");
        this.$profession.setCustomValidity("");
        document.querySelector('input[name="experience"]:checked').setCustomValidity("");
        this.$comment.setCustomValidity("");
  }
  /* Process the already validated form */
  submitForm(formValues) {
    this.$submit.style.visibility = "hidden";
    this.$loadingIndicator.classList.remove('hidden');
    apiCall(this.registrationFormURL,formValues,"POST").then(
        (response)=> {
            console.log("success");
            this.$loadingIndicator.classList.add('hidden');
            this.resetForm();
            toastr.success(response.message);
        }
      ).catch(
        (response) => {
            console.log("failed");
            this.$loadingIndicator.classList.add('hidden');
            toastr.error(response.message);
       }
      );
  }
} 
let home;
window.addEventListener("load", () =>  {home = new Home();});

