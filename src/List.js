import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

@observer
export class List extends React.Component {
  @observable todos = [];
  previousId = 1;

  constructor(props) {
    super(props);

    this.state = {
      current: "",
      count: 0,
      lat: undefined,
      long: undefined
    };

    var positionOptions = {
      // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
      enableHighAccuracy: false,
      // timeout = how long does the device have, in milliseconds to return a result?
      timeout: 5000,
      // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
      maximumAge: 0
    };

    this.onPositionSuccess = this.onPositionSuccess.bind(this);
    this.onPositionError = this.onPositionError.bind(this);

    if (!navigator.geolocation || !navigator.geolocation.getCurrentPosition) {
      throw new Error('The provided geolocation provider is invalid');
    }
    navigator.geolocation.getCurrentPosition(this.onPositionSuccess, this.onPositionError, positionOptions);

    const cachedTodos = JSON.parse(localStorage.getItem('todos'));
    if (cachedTodos) {
      this.todos = JSON.parse(localStorage.getItem('todos'));
    }
  }

  onPositionSuccess(pos) {
    console.log(pos.coords.latitude, pos.coords.longitude);
    this.setState({ lat: pos.coords.latitude.toFixed(20), long: pos.coords.longitude.toFixed(20)});
  }

  onPositionError(error) {
    console.error("Oh no");
  }

  add(todoText, lat, long) {
    // if (this.state.lat === undefined || this.state.long === undefined) {
    //   console.log("dafjf");
    //   return;
    // }
    this.previousId++;
    this.todos.push({id: this.previousId, text: todoText, lat: this.state.lat, long: this.state.long});
    console.log(this.state.lat);
    this.props.sendCount(this.getCount);
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  removeItem(id) {
    this.todos = this.todos.filter(
      function(item) {
        return item.id !== id;
      }.bind(this)
    );
    this.props.sendCount(this.getCount);
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  @computed get getCount() {
    return this.todos.length;
  }

  render() {
    var items = this.todos.map(
      function(item) {
        if (item.lat == this.state.lat && item.long == this.state.long) {
          return (
            <div className="item ui checkbox" key={item.id}>
                <input type="checkbox" name="example" onClick={() => this.removeItem(item.id)} />
                <label>{item.text}: {item.lat}, {item.long}</label>
            </div>
            );
        }
      }.bind(this)
    );

    return (
      <div className="ui huge celled list">
        {items}
      </div>
    );
  }
}
