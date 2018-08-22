import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      tasks:[
        'Do Gardening',
        'Return books to library',
        'Go to the Dentist'
      ],
      inputValue: ""
    }
    // bind handler
    this.handleChange = this.handleChange.bind(this);

    // On enter
    this.handleKeyUp = this.handleKeyUp.bind(this);

  }
  handleChange(e){
    this.setState({inputValue: e.target.value});
  }
  handleKeyUp(e){
    if(e.keyCode === 13){ // enter key
      console.log("pressed enter");
      if(this.state.inputValue){
        const newTasks = [...this.state.tasks, this.state.inputValue];
        this.setState({tasks: newTasks, inputValue: ""});
      } 
      else{
        alert('Please add a task');
      }
    }
  }
  render() {
    return (
   <div className="container">
      <h1>To Do List</h1>
      <input type="text" name="newTask" value={this.state.inputValue} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
      <div className="container">
        <ul className="list-group">
          {
            this.state.tasks.map((task, index) => <li key={index}>{task}</li>)
          }
        </ul>
      </div>
    </div>
    );
  }
}

export default App;
