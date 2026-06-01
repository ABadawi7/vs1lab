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
class InMemoryGeoTagStore {

    #tags = [];

    addGeoTag(tag) {
        this.#tags.push(tag);
    }

    removeGeoTag(name) {
        this.#tags = this.#tags.filter(t => t.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius = 0.01) {
        return this.#tags.filter(t => {
            const dlat = t.latitude - latitude;
            const dlon = t.longitude - longitude;
            return Math.sqrt(dlat * dlat + dlon * dlon) <= radius;
        });
    }

    searchNearbyGeoTags(latitude, longitude, keyword, radius = 0.01) {
        const term = keyword.toLowerCase();
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(t =>
            t.name.toLowerCase().includes(term) || t.hashtag.toLowerCase().includes(term)
        );
    }

}

module.exports = InMemoryGeoTagStore
