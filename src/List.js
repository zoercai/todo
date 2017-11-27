import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import { MapWithAMarkerClusterer } from "./Map";

@observer
export class List extends React.Component {
  @observable todos = [];
  previousId = 1;

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
      this.state = {
        current: "",
        count: 0,
        lat: 0,
        long: 0
      };
      this.onPositionSuccess = this.onPositionSuccess.bind(this);
      this.onPositionError = this.onPositionError.bind(this);
    }

    componentWillMount() {
      const cachedTodos = JSON.parse(localStorage.getItem('todos'));
      if (cachedTodos) {
        this.todos = JSON.parse(localStorage.getItem('todos'));
        this.count = this.todos.length;
        this.previousId = this.todos[this.count-1].id;
        console.warn(this.previousId);
      }
      this.props.sendCount(this.getCount);

      if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
        throw new Error('The provided geolocation provider is invalid');
      }
      navigator.geolocation.watchPosition(this.onPositionSuccess, this.onPositionError, this.positionOptions);
    }

    onPositionSuccess(pos) {
      console.log(pos.coords.latitude, pos.coords.longitude);
      this.setState({ lat: pos.coords.latitude.toFixed(20), long: pos.coords.longitude.toFixed(20)});
    }

    onPositionError(error) {
      console.error("Oh no");
    }

    add(todoText) {
      console.warn("previous ID: " + this.previousId);
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
        });
      this.props.sendCount(this.getCount);
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    @computed get getCount() {
      console.warn("get count");
      return this.count;
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
          if (item.lat == null || item.long == null || this.arePointsClose(this.state.lat, item.lat, this.state.long, item.long)) {
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
        <div>
          <MapWithAMarkerClusterer
            markers={this.todos}
            currentLat={this.state.lat}
            currentLong={this.state.long} 
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          <div className="ui huge celled list">
          {items}
          </div>
        </div>
        );
      }
    }
