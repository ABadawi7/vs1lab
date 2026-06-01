class InMemoryGeoTagStore {

    #geoTags = [];

    // adds a geotag to the store
    addGeoTag(geotag) {
        this.#geoTags.push(geotag);
    }

    // remove all geotags with the given name.
    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(gtag => gtag.name !== name);
    }

    // returns all geotags near a given location.
    getNearbyGeoTags(latitude, longitude, radius = 10) {
        return this.#geoTags.filter(gtag => {
            const distance = this._getDistanceInKm(
                Number(latitude),
                Number(longitude),
                Number(gtag.latitude),
                Number(gtag.longitude)
            );
            return distance <= radius;
        });
    }

    // returns all nearby geotags that match a keyword.
    searchNearbyGeoTags(latitude, longitude, radius = 10, keyword = "") {
        const nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);
        const searchText = String(keyword).trim().toLowerCase();

        if (searchText === "") {
            return nearbyGeoTags;
        }

        return nearbyGeoTags.filter(gtag => {
            return (
                String(gtag.name).toLowerCase().includes(searchText) ||
                String(gtag.hashtag).toLowerCase().includes(searchText)
            );
        });
    }

    // Computes distance between two coordinates in kilometers.
    _getDistanceInKm(lat1, lon1, lat2, lon2) {
        const earthRadiusKm = 6371;

        const dLat = this._toRadians(lat2 - lat1);
        const dLon = this._toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRadians(lat1)) *
            Math.cos(this._toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }

    _toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
}

module.exports = InMemoryGeoTagStore;