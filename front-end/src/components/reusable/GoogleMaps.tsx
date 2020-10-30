import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

interface GoogleMapsProps{
    google: any
}
const GoogleMaps: React.FunctionComponent<GoogleMapsProps> =({google})=> {

return (
<div>
<Map 
            google={google} 
            // containerStyle={{
            //     position: 'relative',
            //     width: '100%',
            //     height: '100%',
            // }}
            />
</div>
);
}
export default GoogleApiWrapper({
    apiKey: ('AIzaSyBoePpl0ehHkrlOpougG15kis84opPXd9c'),
   })(GoogleMaps);
