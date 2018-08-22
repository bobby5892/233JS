// Notice the import statements
import './general';
import apiCall from './services/api/apiCall';
import Chart from 'chart.js';

class Status {
  constructor() {
    /* Part 1 - Finish the constructor
    - Add references to each of these elements on the page
        this.$experienceTab = document.querySelector('#experienceTab');
        this.$professionTab = 
        this.$ageTab = 
        this.$ageCanvas = 
        this.$professionCanvas = 
        this.$experienceCanvas = 
        this.$loadingIndicator = 
        this.$tabArea = 
        this.$chartArea = 
        this.$errorMessage = 
    - Add an instance variable for the data that comes back from the service
        this.statisticData;
    - Call loadData.  It will make the ajax call and create one graph
    - Call addEventListeners
    */
    this.$experienceTab = document.getElementById("experienceTab");
    this.$professionTab = document.getElementById("professionTab");
    this.$ageTab = document.getElementById("ageTab");
    this.$ageCanvas = document.getElementById("ageChart");
    this.$professionCanvas = document.getElementById("professionChart");
    this.$experienceCanvas = document.getElementById("experienceChart");
    this.$loadingIndicator = document.getElementById("loadingIndicator");
    this.$tabArea = document.getElementById("tabArea");
    this.$chartArea = document.getElementById("chartArea");
    this.$errorMessage = document.getElementById("loadingError");
  
    this.statisticData = "";

    this.loadData();
    this.addEventListeners();


  }

/* Part 2 - Write these 2 methods. 
   Instantiate an object at the bottom of the class.
   Then TEST.  The experience chart should work at this point. */
  loadData() {
    /* Make an api call. Because it's a get request with no data,
       the only parameter is '/statistics'.
       When the Promise returns successfully
          set statisticsData to the data that's returned
          hide the loading indicator
          show the tab area and the chart area
          call loadExperience - it's the default chart
       When an error occurs
          hide the loading indicator
          show the error message
      */
      apiCall("statistics").then(
        (response) => {
            this.statisticsData = response;
            console.log("Response: " + JSON.stringify(response));
            console.log("Stored" + JSON.stringify(this.statisticsData));
            this.$loadingIndicator.classList.add("hidden");
            this.$tabArea.classList.remove("hidden");
            this.$chartArea.classList.remove("hidden");
            this.loadExperience();

        }).catch(
          (response) => {
            this.$loadingIndicator.classList.add("hidden");
            this.$errorMessage.classList.remove("hidden");

        });
  }

  addEventListeners() {
    // add a click event handler to the experienceTab.  Call loadExperience.  Bind the class.
    this.$experienceTab.addEventListener("click", (e) => {
       e.preventDefault();
       this.hideCharts();
       this.$experienceTab.parentElement.classList.add('active');

       this.loadExperience.bind(this);
       this.loadExperience();
      this.$experienceCanvas.classList.remove('hidden');
       
    });

    // add a click event handler to the professionTab...
    this.$professionTab.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideCharts();
        this.$professionTab.parentElement.classList.add('active');
        this.loadProfession.bind(this);
        this.loadProfession();
        this.$professionCanvas.classList.remove('hidden');
       
    });
    // add a click event handler to the ageTab...
    this.$ageTab.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideCharts();
        this.$ageTab.parentElement.classList.add('active');
        this.loadAge.bind(this);
        this.loadAge();
        this.$ageCanvas.classList.remove('hidden');
    });
  }

  hideCharts() {
    this.$experienceTab.parentElement.classList.remove('active');
    this.$professionTab.parentElement.classList.remove('active');
    this.$ageTab.parentElement.classList.remove('active');
    this.$ageCanvas.classList.add('hidden');
    this.$professionCanvas.classList.add('hidden');
    this.$experienceCanvas.classList.add('hidden');
  }

  loadExperience() {
    console.log("Loading Experience: " + JSON.stringify(this.statisticsData.experience));
    const data = {
        datasets: [{
            data: this.statisticsData.experience,
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
              'white',
              'white',
              'white',
            ]
        }],
        labels: [
            'Beginner',
            'Intermediate',
            'Advanced'
        ]
    };
    new Chart(this.$experienceCanvas,{
      type: 'pie',
      data,
    });
  }

  /* Part 3 - Write these 2 methods. 
   Then TEST.  All 3 chars should now work. */

  // It's just like the loadExperience but there are 4 'slices' for 
  // 'School Students', 'College Students', 'Trainees', 'Employees'
  loadProfession() {
    console.log("Loading profession: " + JSON.stringify(this.statisticsData.profession));
    const data = {
        datasets: [{
            data: this.statisticsData.profession,
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
              'white',
              'white',
              'white',
            ]
        }],
        labels: [
            'School Students', 'College Students', 'Trainees', 'Employees'
        ]
    };
    new Chart(this.$professionCanvas,{
      type: 'pie',
      data,
    });
  }

  // It's just like the loadExperience but there are 3 'slices' for 
  // '10-15 years', '15-20 years', '20-25 years'
  loadAge() {
    console.log("Loading age: " + JSON.stringify(this.statisticsData.age));
    const data = {
        datasets: [{
            data: this.statisticsData.age,
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
              'white',
              'white',
              'white',
            ]
        }],
        labels: [
            '10-15 years', '15-20 years', '20-25 years'
        ]
    };
    new Chart(this.$ageCanvas,{
      type: 'pie',
      data,
    });
  }

}

let stats;
// add a window on load handler that creates a new instance of this class
window.addEventListener("load", () => {  stats = new Status; });