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

const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

/**
 * Create one central in-memory store.
 */
const geoTagStore = new GeoTagStore();

/**
 * Add example geotags to the store.
 */
GeoTagExamples.tagList.forEach(tag => {
  const geoTag = new GeoTag(tag[0], tag[1], tag[2], tag[3]);
  geoTagStore.addGeoTag(geoTag);
});

/**
 * Helper function:
 * Reads latitude and longitude from request body.
 */
function readCoordinates(body) {
  return {
    latitude: Number(body.latitude),
    longitude: Number(body.longitude)
  };
}

/**
 * Route '/' for HTTP GET requests.
 */
router.get('/', (req, res) => {
  res.render('index', {
    taglist: [],
    latitude: '',
    longitude: ''
  });
});

/**
 * Route '/tagging' for HTTP POST requests.
 *
 * Creates and stores a new GeoTag.
 */
router.post('/tagging', (req, res) => {
  const name = req.body.name;
  const hashtag = req.body.hashtag;
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);

  const geoTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(geoTag);

  const taglist = geoTagStore.getNearbyGeoTags(latitude, longitude);

  res.render('index', {
    taglist: taglist,
    latitude: latitude,
    longitude: longitude
  });
});

/**
 * Route '/discovery' for HTTP POST requests.
 *
 * Searches nearby GeoTags.
 */
router.post('/discovery', (req, res) => {
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);
  const searchterm = req.body.searchterm;

  let taglist;

  if (searchterm && searchterm.trim() !== '') {
    taglist = geoTagStore.searchNearbyGeoTags(latitude, longitude, 10, searchterm);
  } else {
    taglist = geoTagStore.getNearbyGeoTags(latitude, longitude);
  }

  res.render('index', {
    taglist: taglist,
    latitude: latitude,
    longitude: longitude
  });
});

module.exports = router;