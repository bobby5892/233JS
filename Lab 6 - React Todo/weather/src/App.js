import React, { Component } from 'react';
import './App.css';
import Week from './Components/Week';
import WeatherForm from './Components/Form';
import Detail from './Components/Detail';

class App extends Component {
  constructor(props){
    super(props);

    this.daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.months = ["January", "February", "March", "April", "May", "June", "July",
         "August", "September", "October", "November", "December"];
    
    this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
    this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";

    this.state = {
      zipcode: "",
      city: {},
      dates:[],
      selectedDate: -1
    };
    this.handleDayClick.bind(this);    
   }
  getZip(zip){
    let currentState = this.state;
    currentState.zipcode = zip;
   // console.log("ran getZip back in the main app " + zip);
   // console.log("url to pull: " + this.props.url + this.state.zipcode +this.props.apikey);
       fetch(this.url + this.state.zipcode + this.apikey).then( 
          (response) => {
            //console.log(response);
            if(response.status === 400){
              return false;
            }
            return response.json();
          }
        ).then(
          (json) => {
            if(json !== false){
              console.log(json);

              let currentState  = this.state;
              currentState.city = json.city;
              currentState.dates = json.list;
              

              this.setState(currentState);

            }
            else{
              alert("The Zip code you entered resulted in no data, please try again");
            }
          });
    // update views
  }
  handleDayClick(index){
    console.log("A Day was clicked" + index);
    let currentState = this.state;
    currentState.selectedDate = index;
    this.setState(currentState);
    console.log("State Updated:" + this.state.selectedDate);
  }
  render() {
    console.log("App:" + this.daysOfweek);
    return (
     <div id="app-container">
      <div className="app">
         <WeatherForm getZip={this.getZip.bind(this)} />
         <Week state={this.state} months={this.months} daysOfWeek={this.daysOfWeek} onDayClick={this.handleDayClick.bind(this)}/>
         <Detail state={this.state} daysOfWeek={this.daysOfWeek}/>
          </div>
      </div>
    );
  }
}

export default App;
