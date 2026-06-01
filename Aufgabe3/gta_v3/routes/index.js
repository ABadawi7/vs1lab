// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

const tagStore = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, lat, lon, hashtag]) => {
    tagStore.addGeoTag(new GeoTag(lat, lon, name, hashtag));
});

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
    res.render('index', { taglist: [], latitude: '', longitude: '' });
});

router.post('/tagging', (req, res) => {
    const { latitude, longitude, name, hashtag } = req.body;
    tagStore.addGeoTag(new GeoTag(latitude, longitude, name, hashtag));
    const taglist = tagStore.getNearbyGeoTags(latitude, longitude);
    res.render('index', { taglist, latitude, longitude });
});

router.post('/discovery', (req, res) => {
    const { latitude, longitude, searchterm } = req.body;
    let taglist;
    if (searchterm) {
        taglist = tagStore.searchNearbyGeoTags(latitude, longitude, searchterm);
    } else {
        taglist = tagStore.getNearbyGeoTags(latitude, longitude);
    }
    res.render('index', { taglist, latitude, longitude });
});

module.exports = router;
