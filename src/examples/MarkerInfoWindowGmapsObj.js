import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import GoogleMap from '../components/GoogleMap';
import CEBU_CENTER from '../data/cebu_center';

const getInfoWindowString = (place) => `
    <div>
      <div style="font-size: 16px;">
        ${place.name}
      </div>
      <div style="font-size: 14px;">
        <span style="color: grey;">
        ${place.rating}
        </span>
        <span style="color: orange;">${String.fromCharCode(9733).repeat(Math.floor(place.rating))}</span><span style="color: lightgrey;">${String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}</span>
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.types[0]}
      </div>
      <div style="font-size: 14px; color: grey;">
        ${'$'.repeat(place.price_level)}
      </div>
      <div style="font-size: 14px; color: green;">
        ${place.opening_hours.open_now ? 'Open' : 'Closed'}
      </div>
    </div>`;

const handleApiLoaded = (map, maps, places) => {
  const markers = [];
  const infowindows = [];

  places.forEach((place) => {
    markers.push(new maps.Marker({
      position: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      map,
    }));

    infowindows.push(new maps.InfoWindow({
      content: getInfoWindowString(place),
    }));
  });

  markers.forEach((marker, i) => {
    marker.addListener('click', () => {
      infowindows[i].open(map, marker);
    });
  });
};

class MarkerInfoWindowGmapsObj extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
    };
  }

  componentDidMount() {
    fetch('places.json')
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((result) => {
          result.show = false;
        });
        this.setState({ places: data.results });
      });
  }

  render() {
    const { places } = this.state;

    return (
      <>
        {!isEmpty(places) && (
          <GoogleMap
            defaultZoom={10}
            defaultCenter={CEBU_CENTER}
            bootstrapURLKeys={{ key: "AIzaSyDA8m5DsKjP8Xc1J59pdC9LPlebw-m_7pE" }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, places)}
          />
        )}
      </>
    );
  }
}

export default MarkerInfoWindowGmapsObj;
