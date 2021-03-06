import React, {useState, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import { useConditionalEffect } from "../../hooks";

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
useEffect(()=>{
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
