import React from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

@inject('store') @observer
export class Map extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render() {
    return <GoogleMap
      defaultZoom={17}
      center={{ lat: parseFloat(this.props.store.lat), lng: parseFloat(this.props.store.long) }}
      onDragEnd={this.props.store.centerChanged}
      onZoomChanged={this.props.store.zoomChanged}
      ref={this.props.store.onMapMounted}
    >
      {this.props.store.todos.map(marker => (
        <Marker
          key={marker.todoId}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.long) }}
        />
      ))}
    </GoogleMap>
  }
}

export const MapWithMarkers = withScriptjs(withGoogleMap(Map));