import React from "react";
import { observable, computed } from "mobx";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Form } from "./Form";
import { List } from "./List";
import { MapWithMarkers } from "./Map";
import { invokeApig } from "./libs/awsLib";

@inject('store') @observer
export default class Todo extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const result = await this.getTodos();
    this.props.store.replaceTodos(result);

    if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
      throw new Error('The provided geolocation provider is invalid');
    }
    navigator.geolocation.watchPosition(
      (pos) => this.props.store.onPositionSuccess(pos), 
      this.props.store.onPositionError.bind(this.props.store), 
      this.props.store.positionOptions);
  }

  getTodos() {
    return invokeApig({ path: "/todos" });
  }

  render() {
    console.log(this.props.store.todosShowing, this.props.store.todos.length);

    // getvisibletodos(;


    return (
        <div className="ui segment" id="root">
          <h1 className="ui header"> To-Do List </h1>

          <Form />

          <MapWithMarkers
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />

          <List ref="list" />

          <div className="ui horizontal statistic" id="counter">
            <div className="value"> {this.props.store.todosShowing}/{this.props.store.todos.length} </div>
            <div className="label"> Tasks </div>
          </div>
        </div>
    );

  }

}
