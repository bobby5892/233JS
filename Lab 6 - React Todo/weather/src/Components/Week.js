import React, { Component } from 'react';
import Day from "./Day"

class Week extends Component {
  constructor(props){
  	super(props);
  	this.props = props;
  	this.state = this.props.state;
  }
  handleDayClick(index){
  	//console.log("Click Day From Week - Passing up" + JSON.stringify(index));
  	this.props.onDayClick(index);
  }
  render() {
  //	console.log("days of week" + JSON.stringify(this.props.daysOfWeek));
  	let days = this.state.dates;
    return (
      <div id="weatherList" className="flex-parent">
      { days.map((day, index) => 
        <Day 
          key={day.dt} 
          day={day} 
          index={index} 
          onDayClick={this.handleDayClick.bind(this)}  // remember to bind on click the this
          
          months={this.props.months} 
          daysOfWeek={this.props.daysOfWeek}
          />
        ) }
        
      </div>
    );
  }
}

export default Week;
