import './general';

/*
Weather App by Robert Moore
7/25/2018

*/

class Weather{
  constructor(){
     this.daysOfweek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     this.months = ["January", "February", "March", "April", "May", "June", "July",
         "August", "September", "October", "November", "December"];
    this.state = {
      zipcode: "",
      city: {},
      dates:[],
      selectedDate: null
    };
    
    this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
    this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";

    // Create Shorthands
    this.elements = {
     form: document.getElementById("zipForm"),
     zipInput : document.getElementById("zipcode"),
     weatherList: document.getElementById("weatherList"),
     currentDay: document.getElementById("currentDay")
    };
    // Bind
    this.onFormSubmit.bind(this);
    this.renderWeatherList.bind(this);

    // Listener
    this.elements.form.addEventListener("submit", (e) => {
      console.log("submit1");
      e.preventDefault();
      this.onFormSubmit();
    });

    window.addEventListener("click",(e) => {
      if(!isNaN(e.srcElement.dataset.value)){
        
        this.renderCurrentDay(e.srcElement.dataset.value);
      }
      // if they click on h3 instead of in the div
      else if(!isNaN(e.srcElement.parentElement.dataset.value)){
         this.renderCurrentDay(e.srcElement.parentElement.dataset.value);
      }
    });
    console.log("loaded weather");
  }


  onFormSubmit(){
    console.log("submit");
      this.state.zipcode = this.elements.zipInput.value;
      fetch(this.url + this.state.zipcode + this.apikey).then( 
        (response) => {
          console.log(response);
          if(response.status == 400){
            return false;
          }
          return response.json();
        }
      ).then(
        (json) => {
          if(json != false){
            console.log(json);

            this.state.city = json.city;
            this.state.dates = json.list;
            this.selectedDate = null;

            this.elements.zipInput.value = "";
            this.clearCurrentDay();
            this.renderWeatherList(this.state.dates);
          }
          else{
            this.clearAllDays();
            this.elements.weatherList.innerHTML = "<p>The Zip code you entered resulted in no data, please try again</p>";
          }
        }
      );
  }
  clearAllDays(){
    this.elements.weatherList.innerHTML = "";
    this.clearCurrentDay();
  }
  clearCurrentDay(){
    this.elements.currentDay.innerHTML = "";
  }
  renderWeatherList(weatherDays){
    console.log("WeatherDays " + weatherDays);
    const itemsHTML = weatherDays.map((weatherDay, index) => this.renderWeatherListItem(weatherDay, index)).join('');
    this.elements.weatherList.innerHTML = `<div class="weather-list flex-parent"> ` +  itemsHTML + `</div>`;
  }
  renderWeatherListItem(whichDay,index){
    console.log("INDEX:" + index);
    // Process the date
   let [month,day,weekDay] = this.breakDownTime(whichDay.dt)
 
    return `
      <div class="weather-list-item" data-value="${index}" id="weather-item">
          <h3>${this.months[month]}/${day}</h3>
          <h3>${this.daysOfweek[weekDay]}</h3>
          <h3>${whichDay.temp.min} &deg;F | ${whichDay.temp.max} &deg;F</h3>
      </div>
    `;
  }
  renderCurrentDay(index){
    this.clearSelected();
    this.select(index);


    let date = this.state.dates[index];
    let [month,day,weekDay] = this.breakDownTime(date.dt)
    
    console.log("render day " + JSON.stringify(day));
    this.elements.currentDay.innerHTML = `<div class="current-day details">` +
    `<h3>${this.daysOfweek[weekDay]} in ${this.state.city.name}
    <br><img src="http://openweathermap.org/img/w/${this.state.dates[index].weather[0].icon}.png">
    <h4>${this.state.dates[index].weather[0].description}</h4>
    <br>Morning Temperature: ${this.state.dates[index].temp.morn} &deg;F
    <br>Day Temperature: ${this.state.dates[index].temp.day} &deg;F
    <br>Evening Temperature: ${this.state.dates[index].temp.eve} &deg;F
    <br>Night Temperature: ${this.state.dates[index].temp.night} &deg;F
    <br>Atmospheric Pressure: ${this.state.dates[index].pressure}  hPa
    <br>Humidty: ${this.state.dates[index].humidity}%
    <br>Wind Speed: ${this.state.dates[index].speed} mph

    `

    + `</div>`;
  }
  clearSelected(){
    let list = document.querySelectorAll('[data-value]');
    console.log(list);
    for(let weatherItem in list){
        
        // Contains being weird so we'll do it manually
        for(let clas in list[weatherItem].classList){
          if(list[weatherItem].classList[clas] == "selected"){
            list[weatherItem].classList.remove("selected");    
          }
        }
        
    }
  }
  select(index){
    let list = document.querySelectorAll('[data-value]');
    list[index].classList.add("selected");
  }
  breakDownTime(timeInSeconds){
    let month = null;
    let day = null;
    let weekDay;
    let date = new Date(timeInSeconds * 1000);
    
    
    month = date.getMonth();
    day = date.getDate();
    weekDay = date.getDay();

    return [month,day,weekDay];
  }

}
let weather;
window.addEventListener("load", () =>  {weather = new Weather();});

