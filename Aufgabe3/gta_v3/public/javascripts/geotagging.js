// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Here the API used for geolocations is selected
// The following declaration is a 'mockup' that always works and returns a fixed position.
// var GEOLOCATION_API = {
//     getCurrentPosition: function(onsuccess) {
//         onsuccess({
//             "coords": {
//                 "latitude": 49.013790,
//                 "longitude": 8.390071,
//                 "altitude": null,
//                 "accuracy": 39,
//                 "altitudeAccuracy": null,
//                 "heading": null,
//                 "speed": null
//             },
//             "timestamp": 1775140116396
//         });
//     }
// };

// This is the real API.
// If there are problems with it, comment out the line.
GEOLOCATION_API = navigator.geolocation;

/**
  * A class to help using the HTML5 Geolocation API.
  */

/**
 * A class to help using the Leaflet map service.
 */

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    const mapManager = new MapManager();
    const mapImage = document.getElementById('mapView');
    const mapDescription = document.getElementById('mapDescription');
    
    let dLat = document.getElementById('latitude-Discovery').value;
    let dLong = document.getElementById('longitude-Discovery').value;
    
    // Altes Map-View und Beschreibung entfernen, falls sie existieren
    if (mapImage) {
        mapImage.remove();
    }
    if (mapDescription) {
        mapDescription.remove();
    }
    
    // Wenn keine Koordinaten vorhanden sind, Standort neu ermitteln
    if (!dLat && !dLong) { 
        LocationHelper.findLocation(function (locationHelper) {
            const latitude = locationHelper.latitude;
            const longitude = locationHelper.longitude;

            document.getElementById('latitude-Tagging').value = latitude;
            document.getElementById('longitude-Tagging').value = longitude;

            document.getElementById('latitude-Discovery').value = latitude;
            document.getElementById('longitude-Discovery').value = longitude;

            const taglist_json = document.getElementById('map').getAttribute('data-tags');
            
            mapManager.initMap(latitude, longitude);
            mapManager.updateMarkers(latitude, longitude, JSON.parse(taglist_json));

            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
        });
    } 
    // Wenn Koordinaten bereits da sind, diese direkt nutzen
    else {
        const taglist_json = document.getElementById('map').getAttribute('data-tags');
        
        mapManager.initMap(dLat, dLong);
        mapManager.updateMarkers(dLat, dLong, JSON.parse(taglist_json));
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});