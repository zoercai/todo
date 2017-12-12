import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import { Form } from "./Form";
import { List } from "./List";
import { MapWithMarkers } from "./Map";
import { invokeApig } from "./libs/awsLib";

@observer
export default class Todo extends React.Component {
	@observable todos = [];
	@observable previousId = 0;
	@observable lat = 0;
	@observable long = 0;

	positionOptions = {
      // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
      enableHighAccuracy: true,
      // timeout = how long does the device have, in milliseconds to return a result?
      timeout: 5000,
      // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
      maximumAge: 0,
      distanceFilter: 1
  };

  constructor(props) {
  	super(props);
  	this.onPositionSuccess = this.onPositionSuccess.bind(this);
  	this.onPositionError = this.onPositionError.bind(this);
  	this.addTodo = this.addTodo.bind(this);
  	this.removeItem = this.removeItem.bind(this);
  }

  async componentWillMount() {
  	// const cachedTodos = JSON.parse(localStorage.getItem('todos'));
    this.todos = await this.getTodos();    
    this.count = this.todos.length;
    this.previousId = parseInt(this.todos[this.count-1].todoId);

    console.warn("todos retrieved" + this.todos);

  	if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
  		throw new Error('The provided geolocation provider is invalid');
  	}
  	navigator.geolocation.watchPosition(this.onPositionSuccess, this.onPositionError, this.positionOptions);
  }

  onPositionSuccess(pos) {
  	this.lat = pos.coords.latitude.toFixed(20);
  	this.long = pos.coords.longitude.toFixed(20);
  }

  onPositionError(error) {
  	console.error("Position Error");
  }

  async addTodo(todoText) {
  	
  	// localStorage.setItem('todos', JSON.stringify(this.todos));

    try {
      await this.createTodo({
        id: this.previousId + "",
        todoId: this.previousId + "",
        content: todoText,
        lat: this.lat,
        long: this.long
      });
      this.previousId++;
      this.todos.push({todoId: this.previousId, content: todoText, lat: this.lat, long: this.long});
      this.props.history.push("/");
    } catch (e) {
      alert(e);
    }
  }

  createTodo(todo) {
    return invokeApig({
      path: "/todos",
      method: "POST",
      body: todo
    });
  }

  getTodos() {
    return invokeApig({ path: "/todos" });
  }

  removeItem(id) {
  	this.todos = this.todos.filter(
  		function(item) {
  			return item.todoId !== id;
  		});
  	// localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  render() {
  	return (
  		<div className="ui segment" id="root">
		  	<h1 className="ui header"> To-Do List </h1>

		  	<Form addTodo={this.addTodo} />

		  	<MapWithMarkers
		  	markers={this.todos}
		  	currentLat={this.lat}
		  	currentLong={this.long} 
		  	googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
		  	loadingElement={<div style={{ height: `100%` }} />}
		  	containerElement={<div style={{ height: `400px` }} />}
		  	mapElement={<div style={{ height: `100%` }} />}
		  	/>

		  	<List ref="list" removeItem={this.removeItem} todos={ this.todos } currentLat={ this.lat } currentLong={this.long}/>

		  	<div className="ui horizontal statistic" id="counter">
		  	<div className="value"> {this.todos.length} </div>
		  	<div className="label"> Tasks </div>
		  	</div>
	  	</div>
  	);
  	
  }

}
