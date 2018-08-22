import './general';

/*
    http://api.openweathermap.org/data/2.5/forecast/daily?zip=97405&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646
*/

class Weather {
  constructor() {
    this.state = {
      zipcode: "",
      city: {},
      dates: [],
      selectedDate: null
    };
    this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
    this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";

    this.$form = document.querySelector('#zipForm');
    this.$zipcode = document.querySelector('#zipcode');
    this.$weatherList = document.querySelector('#weatherList');

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.renderWeatherList = this.renderWeatherList.bind(this);
    this.renderWeatherlistItem = this.renderWeatherListItem.bind(this);
    this.$form.addEventListener('submit', this.onFormSubmit);

    this.$currentDay = document.querySelector('#currentDay');
    this.addItemClickHandlers = this.addItemClickHandlers.bind(this);
    this.clearCurrentDay = this.clearCurrentDay.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.state.zipcode = this.$zipcode.value;
    fetch(`${this.url}${this.state.zipcode}${this.apikey}`)
    .then(response => response.json())
    .then(data => { 
      //const {city, list: dates } = data;
      this.state.city = data.city;
      this.state.dates = data.list;
      this.state.selectedDate = null;
      this.$zipcode.value = "";
      this.renderWeatherList(this.state.dates);
      this.clearCurrentDay();
      this.addItemClickHandlers();
    })
    .catch(error => {
        alert('There was a problem getting info!'); 
    }); 
  }

  renderWeatherList(days) {
    const itemsHTML = days.map((day, index) => this.renderWeatherListItem(day, index)).join('');
    this.$weatherList.innerHTML = 
      `<div class="weather-list flex-parent">
          ${itemsHTML}
      </div>`;
  }

  addItemClickHandlers() {
    const items = document.querySelectorAll('.weather-list-item');
    for (let i = 0; i < items.length; i++)
      items[i].onclick = this.renderCurrentDay.bind(this, [i]);
  }

  getWeekday(date) {
    const dayNames = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = date.getDay();
    return dayNames[weekday];
  }

  renderWeatherListItem(day, index) {
    const date = new Date(day.dt * 1000);
    const weekday = this.getWeekday(date);
    const city = this.state.city;
    return `
        <div class="weather-list-item" data-index="${index}">
            <h2>${date.getMonth() + 1} / ${date.getDate()}</h2>
            <h3>${weekday}</h3>
            <h3>${day.temp.min.toFixed(1)}&deg;F &#124; ${day.temp.max.toFixed(1)}&deg;F</h3>
        </div>
    `;
  }

  renderCurrentDay(params) {
    const index = params[0];
    const city = this.state.city;
    const day = this.state.dates[index];
    const w = day.weather[0];
    const date = new Date(day.dt * 1000);
    const weekday = this.getWeekday(date);
    const dayHTML = `
      <div class="current-day">
        <h1 class="day-header">${weekday} in ${city.name}</h1>
        <div class="weather">
        <p>
            <img src='http://openweathermap.org/img/w/${w.icon}.png' alt='${w.description}'/>
            ${w.description}
        </p>
      </div>
      <div class="details flex-parent">
        <div class="temperature-breakdown">
          <p>Morning Temperature: ${day.temp.morn}&deg;F</p>
          <p>Day Temperature: ${day.temp.day}&deg;F</p>
          <p>Evening Temperature: ${day.temp.eve}&deg;F</p>
          <p>Night Temperature: ${day.temp.night}&deg;F</p>
        </div>
        <div class="misc-details">
          <p>Atmospheric Pressure: ${day.pressure} hPa</p>
          <p>Humidity: ${day.humidity}%</p>
          <p>Wind Speed: ${day.speed} mph</p>
        </div>
      </div>
    </div>
    `;
    this.$currentDay.innerHTML = dayHTML;
  }

  clearCurrentDay() {
    this.$currentDay.innerHTML = "";
  }
}

new Weather();
