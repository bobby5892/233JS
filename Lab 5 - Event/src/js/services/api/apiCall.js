const timeoutDuration = 5000;

/*  This is complicated.  The only part of this that you REALLY need to understand
    is how to call the function.  The first parameter is the url, the second is the data
    and the third is the method.  Notice that the default method is get and 
    by default there is no data.  You can call the method with 1, 2 or 3 parameters.
*/
export default function apiCall(route, body = {}, method='GET') {

    /* Instantiate a promise object. Recall that a Promise is an asynchronous
       construct that "promises" that eventually it will return successfully
       or unsuccessfully. 
    
       The parameter for the constructor is a function (in this case an arrow function) 
       that has 2 parameters - the function that will get called when the promise 
       is successful and the function that will get called when the promise
       completes unsuccessfully. resolve and reject are not functions that you define 
       but are part of the promise "infrastructure".  You will call them 
       to return a value or an error.
    */
    const request = new Promise((resolve, reject) => {

      // define some technical information for the ajax call
      const headers = new Headers({
        'Content-Type': 'application/json',
      });
      const requestDetails = {
        method,
        mode: 'cors',
        headers,
      };

      // if you're making post request add the data as a json object to the request
      if(method !== 'GET') requestDetails.body = JSON.stringify(body);

      // a helper function that returns either json or an error
      // it gets called when the call to fetch returns
      function handleErrors(response) {
        if(response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      }

      /* Here's the actual ajax call.
         Where does each of the arguments come from?
         When fetch completes, call handleErrors - return json or throw an exception
         When handleErrors completes - the promise completes successfully
         When handleErrors throws an exception - the promise completes unsuccessfully
      */
      fetch(`${SERVER_URL}/${route}`, requestDetails)
        .then(handleErrors)
        .then(resolve)
        .catch(reject);

    }); // end of Promise called request

    /* Create another promise.  It completes unsuccessfully after 5 seconds.
       It never calls request which means that it never completes successfully.
    */
    const timeout = new Promise((request, reject) => {
      setTimeout(reject, timeoutDuration, `Request timed out!`);
    }); // end of Promise called timeout

    /* The method ultimately returns a promise, 
       either the promise that results from the ajax call or
       the promise that resulted from the 5 second timeout,
       which ever finishes first
    */
    return new Promise((resolve, reject) => {
      Promise.race([request, timeout])
        .then(resolve)
        .catch(reject);
    }); 
}
