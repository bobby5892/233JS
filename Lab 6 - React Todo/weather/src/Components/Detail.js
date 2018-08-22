import React, { Component } from 'react';


class Detail extends Component {
  constructor(props){
  	super(props);
  	this.props = props;
  	this.state = this.props.state;
  	console.log("Detail Scope: " + JSON.stringify(this));
  	console.log("Detail Props: "+ JSON.stringify(this.props));

  }
  breakDownTime(timeInSeconds){
    let weekDay;
    let date = new Date(timeInSeconds * 1000);
    weekDay = date.getDay();

    return weekDay;
  }
  render() {
  	console.log("selectedDate:" + this.props.state.selectedDate);
    if(this.props.state.selectedDate !== -1){
    	let weekDay = this.breakDownTime(this.props.state.dates[this.props.state.selectedDate].dt)
    	console.log("Weekday: " + weekDay);
    	console.log("Week:" + this.props.daysOfWeek);
    	let image = "http://openweathermap.org/img/w/" + 
    		this.state.dates[this.props.state.selectedDate].weather[0].icon + ".png";

	    return (
	     	<div className="current-day details">
			    <h3>{this.props.daysOfWeek[weekDay]} in {this.props.state.city.name}</h3>
			    <br/><img src={image}/>
			    <h4>{this.props.state.dates[this.props.state.selectedDate].weather[0].description}</h4>
			    <br/>Morning Temperature: {this.props.state.dates[this.props.state.selectedDate].temp.morn} &deg;F
			    <br/>Day Temperature: {this.props.state.dates[this.props.state.selectedDate].temp.day} &deg;F
			    <br/>Evening Temperature: {this.props.state.dates[this.props.state.selectedDate].temp.eve} &deg;F
			    <br/>Night Temperature: {this.props.state.dates[this.props.state.selectedDate].temp.night} &deg;F
			    <br/>Atmospheric Pressure: {this.props.state.dates[this.props.state.selectedDate].pressure}  hPa
			    <br/>Humidty: {this.props.state.dates[this.props.state.selectedDate].humidity}%
			    <br/>Wind Speed: {this.props.state.dates[this.props.state.selectedDate].speed} mph
	       	</div>
	    );
	}
	else{
		return (
			<div>
			</div>
		)
	}
  }
}

export default Detail;
