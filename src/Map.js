import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

export const MapWithMarkers = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={17}
    center={{ lat: parseFloat(props.currentLat), lng: parseFloat(props.currentLong) }}
  >
    {props.markers.map(marker => (
        <Marker
          key={marker.todoId}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.long) }}
        />
    ))}
  </GoogleMap>
))