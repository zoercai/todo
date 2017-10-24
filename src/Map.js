import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

export const MapWithAMarkerClusterer = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={17}
    defaultCenter={{ lat: parseFloat(props.currentLat), lng: parseFloat(props.currentLong) }}
  >
    {props.markers.map(marker => (
        <Marker
          key={marker.id}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.long) }}
        />
    ))}
  </GoogleMap>
))
