import React, { Component } from 'react';


class Day extends Component {
  constructor(props){
	super(props);
  	this.props = props;
  	this.state = this.props.state;
 
  }
  breakDownTime(timeInSeconds){
    let month = null;
    let day = null;
    let weekDay;
    let date = new Date(timeInSeconds * 1000);
    
    
    month = date.getMonth();
    day = date.getDate();
    weekDay = date.getDay();
   // console.log("Discovered " + month);
    return [month,day,weekDay];
  }
  onClick(event){
		this.props.onDayClick(this.props.index);
  }
  render() {
  	let months = this.props.months;
  	let daysOfWeek = this.props.daysOfWeek;
  	let today = this.props.day;

  	//console.log("rendering day" + JSON.stringify(today));
  	let [month,day,weekDay] = this.breakDownTime(today.dt);


  	//console.log("weekdays: " + JSON.stringify(this.props.daysOfWeek));
    return (
      <div className="weather-list-item" id="weather-item" onClick={this.onClick.bind(this)}>
       		<h3>{months[month]}/{day}</h3>
       		<h3>{daysOfWeek[weekDay]}</h3>
          	<h3>{today.temp.min} &deg;F | {today.temp.max} &deg;F</h3>
      </div>
      
    );
  }
}

export default Day;
