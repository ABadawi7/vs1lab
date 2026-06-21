// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Here the API used for geolocations is selected
// The following declaration is a 'mockup' that always works and returns a fixed position.


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
let mapManager;

function updateLocation() {
    const taggingLatitude = document.getElementById("latitude-Tagging");
    const taggingLongitude = document.getElementById("longitude-Tagging");

    const discoveryLatitude = document.getElementById("latitude-Discovery");
    const discoveryLongitude = document.getElementById("longitude-Discovery");

    mapManager = new MapManager();

    function setLocation(latitude, longitude) {
        taggingLatitude.value = latitude;
        taggingLongitude.value = longitude;

        discoveryLatitude.value = latitude;
        discoveryLongitude.value = longitude;

        const mapElement = document.getElementById("map");
        const taglistJson = mapElement.dataset.tags;
        const taglist = taglistJson ? JSON.parse(taglistJson) : [];

        if (taglist.length > 0) {
            mapManager.initMap(taglist[0].latitude, taglist[0].longitude);
        } else {
            mapManager.initMap(latitude, longitude);
        }

        mapManager.updateMarkers(latitude, longitude, taglist);
    }

    
        LocationHelper.findLocation((location) => {
            setLocation(location.latitude, location.longitude);
        });
    
}

/**
 * Helper function to update the Map and List
 * @param {Array} tagList 
 */

function updateView(tagList) {
    // 1. Liste aktualisieren
    var discoveryResults = document.getElementById("discoveryResults");
    if (discoveryResults) {
        discoveryResults.innerHTML = ""; 

        tagList.forEach(function(tag) {     
            var li = document.createElement("li");
            li.innerHTML = tag.name + " (" + tag.latitude + ", " + tag.longitude + ") " + tag.hashtag;
            discoveryResults.appendChild(li);
        });
    }

   
    var latInput = document.getElementById("latitude-Tagging");     
    var lonInput = document.getElementById("longitude-Tagging");
    
    if (mapManager && latInput && lonInput) {        
        mapManager.updateMarkers(latInput.value, lonInput.value, tagList);
    }
}


function readTagForm () {
    var latitude = document.getElementById("latitude-Tagging").value;
    var longitude = document.getElementById("longitude-Tagging").value;
    var name = document.getElementById("name").value;
    var hashtag = document.getElementById("hashtag").value;

    //if(!latitude || !longitude || !name ) return;

    var geotag = {
        name : name,
        latitude : parseFloat(latitude),
        longitude : parseFloat(longitude),
        hashtag : hashtag
    };

    return geotag;
}

async function handleDiscoveryForm() {

    var lat = document.getElementById("latitude-Discovery").value;      //Werte aus Discovery Form auslesen
    var lon = document.getElementById("longitude-Discovery").value;
    var searchterm = document.getElementById("searchterm") ? document.getElementById("searchterm").value : "";

   var res = await fetch('/api/geotags?latitude='+lat+'&longitude='+lon+'&searchterm='+searchterm,{
        method: "GET",                  //mit fetch und des ausgelesenen Werten die Geotags abfragen
        headers: {
            'Accept':'application/json'
        }
    });

    return await res.json();      //Response in JS-Objekt umwandeln
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const tagForm = document.getElementById("tag-form");
    const discoveryForm = document.getElementById("discoveryFilterForm");


if (tagForm) {
        tagForm.addEventListener("submit", async (event) => {
             event.preventDefault();
            
              // TODO: Nächster Schritt -> Formular-Validierung & POST-Fetch
              var geotag = readTagForm();


                fetch("/api/geotags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(geotag)
              })
              .then(response => response.json())
              .then(result => console.log("GeoTag added:", result))
              .catch(error => console.error("Fehler:", error));


                fetch('/api/geotags?latitude='+geotag.latitude+'&longitude='+geotag.longitude, {                              
                headers: {"Accept":"application/json"} 
            })
                .then(response => response.json())                  
                .then(nearbyGeoTags => updateView(nearbyGeoTags))  
                .catch(error => console.error("Fehler:", error));

        });
    } 


if(discoveryForm){
        discoveryForm.addEventListener("submit", async (event) => {
            event.preventDefault();     //standardmaeßiges Absenden des Formulars verhindert
            
            handleDiscoveryForm()      //stattdessen wird Funktion mit fetch API aufgerufen  
                .then(geotags => {
                    console.log(geotags);
                    return geotags;   
                })
                .then(geotags => updateView(geotags))
                .catch(error => console.error("Fehler:", error)); 
        });
    }
    




    
});