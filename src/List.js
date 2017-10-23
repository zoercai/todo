import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

@observer
export class List extends React.Component {
  @observable todos = [];
  previousId = 1;

  positionOptions = {
      // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
      enableHighAccuracy: false,
      // timeout = how long does the device have, in milliseconds to return a result?
      timeout: 5000,
      // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
      maximumAge: 0
    };

    constructor(props) {
      super(props);

      this.state = {
        current: "",
        count: 0,
        lat: null,
        long: null
      };

      this.getCurrentLocation = this.getCurrentLocation.bind(this);

      if (!navigator.geolocation || !navigator.geolocation.getCurrentPosition) {
        throw new Error('The provided geolocation provider is invalid');
      }

      this.getCurrentLocation()
      .then(pos => {this.setState({ lat: pos.coords.latitude.toFixed(20), long: pos.coords.longitude.toFixed(20) })})
      .catch(err => console.error("Oh no"));

      // const cachedTodos = JSON.parse(localStorage.getItem('todos'));
      // if (cachedTodos) {
      //   this.todos = JSON.parse(localStorage.getItem('todos'));
      // }
    }

    getCurrentLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, this.positionOptions);
        console.warn("something inside the promise");
      })
    }

    add(todoText) {
      this.getCurrentLocation()
      .then(pos => {
        this.previousId++;
        this.todos.push({id: this.previousId, text: todoText, lat: pos.coords.latitude.toFixed(20), long: pos.coords.longitude.toFixed(20)});
        console.warn("got this lat: " + this.state.lat);
        this.props.sendCount(this.getCount);
        // localStorage.setItem('todos', JSON.stringify(this.todos));
      })
      .catch(err => console.warn("Could not get location."))
    }

    removeItem(id) {
      this.todos = this.todos.filter(
        function(item) {
          return item.id !== id;
        }.bind(this)
        );
      this.props.sendCount(this.getCount);
      // localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    @computed get getCount() {
      return this.todos.length;
    }

    arePointsClose(lat1, lat2, lon1, lon2) {
      function degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
      }
      var accuracy = 10;
      lat1 = degrees_to_radians(lat1);
      lat2 = degrees_to_radians(lat2);
      lon1 = degrees_to_radians(lon1);
      lon2 = degrees_to_radians(lon2);
      var distance = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon1-lon2)) * 6371000;
      console.warn("DISTANCE IS : " + distance);
      return (distance < accuracy && distance > -accuracy);
    }

    render() {
      var items = this.todos.map(
        function(item) {
          console.warn("rendering" + this.state.lat);
          console.warn(this.state.lat + " " + this.state.long);
          console.warn(item.lat + " " + item.long);
          if (this.arePointsClose(this.state.lat, item.lat, this.state.long, item.long)) {
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
