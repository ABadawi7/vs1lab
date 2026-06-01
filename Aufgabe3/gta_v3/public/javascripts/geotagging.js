// File origin: VS1LAB A3

console.log("The geoTagging script is going to start...");

function updateLocation() {
    const latField = document.getElementById('latitude-Tagging');
    const lonField = document.getElementById('longitude-Tagging');
    const mapDiv = document.getElementById('map');
    const tags = JSON.parse(mapDiv.dataset.tags);

    if (latField.value && lonField.value) {
        const mapManager = new MapManager();
        mapManager.initMap(latField.value, lonField.value);
        mapManager.updateMarkers(latField.value, lonField.value, tags);

        document.getElementById('latitude-Discovery').value = latField.value;
        document.getElementById('longitude-Discovery').value = lonField.value;

        document.getElementById("mapView").remove();
        document.getElementById("mapDescription").remove();
    } else {
        LocationHelper.findLocation(function(locationHelper) {
            const latitude = locationHelper.latitude;
            const longitude = locationHelper.longitude;

            latField.value = latitude;
            lonField.value = longitude;

            document.getElementById('latitude-Discovery').value = latitude;
            document.getElementById('longitude-Discovery').value = longitude;

            const mapManager = new MapManager();
            mapManager.initMap(latitude, longitude);
            mapManager.updateMarkers(latitude, longitude, tags);

            document.getElementById("mapView").remove();
            document.getElementById("mapDescription").remove();
        });
    }
}

document.addEventListener("DOMContentLoaded", updateLocation);
