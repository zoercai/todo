import { observable, action, toJS } from 'mobx';
import { invokeApig } from "./libs/awsLib";

class Store {
  accuracyForZoom17 = 160;
  @observable isAuthenticated = false;
  @observable isAuthenticating = true;
  @observable todos = [];
  @observable todosShowing = 0;
  @observable previousId = 0;
	@observable lat = 0;
  @observable long = 0;
  @observable accuracy = this.accuracyForZoom17;
  positionOptions = {
    // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
    enableHighAccuracy: true,
    // timeout = how long does the device have, in milliseconds to return a result?
    timeout: 5000,
    // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
    maximumAge: 0,
    distanceFilter: 1
  };

  @action userHasAuthenticated = (authenticated) => {
  	this.isAuthenticated = authenticated;
  }

  getIsAuthenticated = () => this.isAuthenticated;

  @action setIsAuthenticating = (authenticating) => {
  	this.isAuthenticating = authenticating;
  }

  getIsAuthenticating = () => this.isAuthenticating;

  @action replaceTodos(result) {
    if (result.length != 0) {
      this.todos = result;
      this.previousId = parseInt(this.todos[this.todos.length-1].todoId);
    }
  }

  @action async addTodo(todoText) {
    try {
      this.incrementPreviousId();
      await this.createTodo({
        id: this.previousId + "",
        todoId: this.previousId + "",
        content: todoText,
        lat: this.lat,
        long: this.long
      });
      this.todos.push({todoId: this.previousId, content: todoText, lat: this.lat, long: this.long});
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

  deleteTodo(todoId) {
    return invokeApig({
      path: "/todos/" + todoId,
      method: "DELETE"
    });
  }

  @action async removeTodo(id) {
    await this.deleteTodo(id);
    this.todos = this.todos.filter(
      function (item) {
        return item.todoId !== id;
    });
  }

  @action incrementPreviousId() {
    this.previousId = this.previousId + 1;
    console.log("Incremented id, new current ID: " + this.previousId);
  }

  @action onPositionSuccess(pos) {
    console.warn("Position success");
  	this.lat = pos.coords.latitude.toFixed(20);
  	this.long = pos.coords.longitude.toFixed(20);
  }

  @action onPositionError(error) {
  	console.error("Position Error");
  }

  @action centerChanged = () => {
    this.lat = this.map.getCenter().lat().toFixed(20);
    this.long = this.map.getCenter().lng().toFixed(20);
  }

  @action zoomChanged = () => {
    this.accuracy = this.accuracyForZoom17 * Math.pow(2, 17 - this.map.getZoom());
  }

  @action changeTodosShowing(numShowing) {
    this.todosShowing = numShowing;
  }

  @action incrementTodosShowing() {
    this.todosShowing++;
  }

  @action onMapMounted = (ref) => {
    this.map = ref;
    console.warn("map loaded" + ref);
  }
  
}

export default Store;