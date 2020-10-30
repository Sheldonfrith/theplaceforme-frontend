import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import {Loader, LoaderOptions} from 'google-maps';
import { mapState } from 'xstate';
import useMyEffect from '../../lib/Hooks/useMyEffect';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBoePpl0ehHkrlOpougG15kis84opPXd9c");
Geocode.enableDebug();

interface MapProps{
    locationName: string,
}
const Map: React.FunctionComponent<MapProps> =({locationName})=> {

    const [centerLocation, setCenterLocation] = useState<any>(null);
    
    const initGeocoder =()=> {
        Geocode.fromAddress(locationName).then(
            (response: any)=>{
                const coords = response.results[0].geometry.location;
                setCenterLocation(coords);
                console.log(coords);
            },
            (error: any)=>{
                console.log(error);
            }
        );
};
//initialize the geocoder and set the location
useMyEffect([true],()=>{
    initGeocoder();
},[]);

//if the location was retrieved successfully, then render the map
if (!centerLocation){
    return <></>;
} else {
    return (
        <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBoePpl0ehHkrlOpougG15kis84opPXd9c' }}
                defaultZoom={4}
                defaultCenter={centerLocation}
              >
        </GoogleMapReact>
        );
}
}
export default Map;
