import React from "react";
import { observer } from "mobx-react";

@observer
export class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "",
    };
  }

  removeItem(id) {
    this.props.removeItem(id);
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
    return (distance < accuracy && distance > -accuracy);
  }

  render() {
    var todosWithinRange = this.props.todos.map(
      function(item) {
        console.info("current location: " + this.props.currentLat + " " + this.props.currentLong);
        console.info("item location: " + item.lat + " " + item.long);
        if (item.lat == null || item.long == null || this.arePointsClose(this.props.currentLat, item.lat, this.props.currentLong, item.long)) {
          return (
            <div className="item ui checkbox" key={item.todoId}>
            <input type="checkbox" name="example" onClick={() => this.removeItem(item.todoId)} />
            <label>{item.content}: {item.lat}, {item.long}</label>
            </div>
            );
        }
      }.bind(this)
      );

    return (
          <div className="ui huge celled list">
          {todosWithinRange}
          </div>
          );
        }
      }

