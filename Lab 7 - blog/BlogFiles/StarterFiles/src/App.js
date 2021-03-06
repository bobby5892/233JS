import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.min.css";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { NavLink, Route, withRouter } from 'react-router-dom';

import './App.css';
import routes from './routes';
import Home from './Components/Home/Home';
import Post from './Components/Post/Post';
import AuthorList from './Components/Author/AuthorList';
import AuthorPosts from './Components/Author/AuthorPosts';
import NewPost from './Components/NewPost/NewPost';


class App extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		isOpen: false
  	};
  	
   }
   toggle(){
   	let currentState = this.state;
  	currentState.isOpen = !this.state.isOpen;
  	this.setState(currentState);		
  }
  render() {
    return (
      <div className="App">
        <Navbar color="faded" light toggleable>
	        <NavbarToggler right onClick={this.toggle.bind(this)} />
	        <NavLink className="navbar-brand" to={routes.home}>Blog</NavLink>
	        <Collapse isOpen={this.state.isOpen} navbar>
	        	<Nav className="m1-auto" navbar>
		        	<NavItem>
		        		<NavLink className="nav-link" activeClassName="active" to={routes.home}>Home</NavLink>
		        	</NavItem>
		        	<NavItem>
		        		<NavLink className="nav-link" activeClassName="active" to={routes.authors}>Authors</NavLink>
		        	</NavItem>
		        	<NavItem>
		        		<NavLink className="nav-link" activeClassName="active" to={routes.newPost}>New Post</NavLink>
		        	</NavItem>
		        </Nav>
	        </Collapse>
        </Navbar>
        <Route exact path={routes.home} component={Home} />
        <Route exact path={routes.post} component={Post} />
        <Route exact path={routes.authors} component={AuthorList} />
        <Route exact path={routes.author} component={AuthorPosts} />
        <Route exact path={routes.newPost} component={NewPost} />
      </div>
    );
  }
}

export default withRouter(App);
