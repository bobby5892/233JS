import React, { Component } from 'react';


class Form extends Component {
  constructor(props){
  	
  	super(props);
  	this.props = props;
  	//Local to FORM
  	this.state = {
  		zipcode : ""
  	}
  }	
  getData(zipCode){
    this.props.getZip(this.state.zipcode);
  }	
  handleChange(event){
  	let currentState = this.state;
  	currentState.zipcode = event.target.value;
  	this.setState(currentState);
  }
  handleSubmit(event){
  	event.preventDefault();
  	if(this.state.zipcode.length !== 5){
  		alert("You must enter a valid 5 digit zip code");
  	}
  	else{
  		//console.log("Zip code is" + this.state.zipcode);
  		this.getData(this.state.zipcode);
  	}
  }
  render() {
    return (
       <div className="zip-form">
              <form id="zipForm" onSubmit={this.handleSubmit.bind(this)}>
                  <div className="flex-parent">
                    <label htmlFor="zipcode">Zip</label>
                    <input className="form-control"
                        type="input" name="zipcode" 
                        value={this.state.zipcode} required onChange={this.handleChange.bind(this)}
                    />
                    <button type="submit" className="btn btn-success" > Get the forcast!</button>
                </div>
              </form>
          </div>
    );
  }
}

export default Form;
