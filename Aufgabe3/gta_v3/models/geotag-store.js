// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    constructor(){
        this._geoTags = [];
    }
    // adds a geotag to the store
    addGeoTag(geotag){
        this._geoTags.push(geotag);
    }

    // remove all geotags with the given name.
    removeGeoTag(name){
        this._geoTags = this._geoTags.filter(gtag => gtag.name !== name);
    }
    // returns all geotags near a given location.
    getNearbyGeoTags(latitude, longitude, radius = 10){
        return this._geoTags.filter(gtag => {
            const distance = this._getDistanceInKm(
                latitude,
                longitude,
                gtag.latitude,
                gtag.longitude
            );
            return distance <= radius;
        });
    }

    // returns all nearby geotags that match a keyword.

    searchNearbyGeoTags(latitude, longitude, radius = 10, keyword =""){
        const nearbyGoeTags = this.getNearbyGeoTags(latitude,longitude,radius);
        if(!keyword || keyword.trim() ===""){
            return nearbyGoeTags;
        }
        const searchText = keyword.toLowerCase();

        return nearbyGoeTags.filter(gtag =>{
            return (
                gtag.name.toLowerCase().inclusdes(searchText) ||
                gtag.hashtag.toLowerCase().inclusdes(searchText)
            );
        });
    }
    // Computers distance between two coordinates in kilometers.
    _getDistanceInKm(lat1,lon1, lat2, lon2){
        const earthRadiusKm = 6371;

        const dLat = this._toRadians(lat2 - lat1);
        const dLon = this._toRadians(lon2 - lon1);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat /2)+
            Math.cos(this._toRadians(lat1)) *
            Math.cos(this._toRadians(lat2)) *
            Math.sin(dLon / 2 ) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;

    }
    _toRadians(degress){
            return degress * Math.PI / 180;
    }
}

module.exports = InMemoryGeoTagStore;
