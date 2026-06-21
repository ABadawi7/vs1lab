// File origin: VS1LAB A2 / Extended for Pagination

/* eslint-disable no-unused-vars */

console.log("The geoTagging script is going to start...");

// Globaler Zustand für das Paging
let currentPage = 1;
const perPage = 5;

/**
 * Reads the current browser location and writes it into both forms.
 */
function updateLocation() {
    const taggingLatitude = document.getElementById("latitude-Tagging");
    const taggingLongitude = document.getElementById("longitude-Longging"); // Hinweis: Prüfe ggf. ID-Schreibweise in index.ejs falls nötig, hier belassen wie im Original
    const discoveryLatitude = document.getElementById("latitude-Discovery");
    const discoveryLongitude = document.getElementById("longitude-Discovery");

    window.mapManager = new MapManager();
    const mapManager = window.mapManager;

    function setLocation(latitude, longitude) {
        if(taggingLatitude) taggingLatitude.value = latitude;
        // Falls longitude-Tagging im Original ein Tippfehler war, fangen wir es sicherheitshalber ab
        const taggingLonEl = document.getElementById("longitude-Tagging") || taggingLongitude;
        if(taggingLonEl) taggingLonEl.value = longitude;

        if(discoveryLatitude) discoveryLatitude.value = latitude;
        if(discoveryLongitude) discoveryLongitude.value = longitude;

        const mapElement = document.getElementById("map");
        const taglistJson = mapElement ? mapElement.dataset.tags : null;
        const taglist = taglistJson ? JSON.parse(taglistJson) : [];

        if (taglist.length > 0) {
            mapManager.initMap(taglist[0].latitude, taglist[0].longitude);
        } else {
            mapManager.initMap(latitude, longitude);
        }

        // Beim ersten Laden der Seite fordern wir direkt die paginierten Daten an
        loadPage(1);
    }

    LocationHelper.findLocation((location) => {
        setLocation(location.latitude, location.longitude);
    });
}

/**
 * Aktualisiert die Steuerungselemente der Pagination
 */
function updatePaginationControls(metadata) {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');

    if (!metadata || !btnPrev || !btnNext || !currentPageSpan || !totalPagesSpan) return;

    currentPage = metadata.currentPage;
    currentPageSpan.textContent = metadata.currentPage;
    totalPagesSpan.textContent = metadata.totalPages || 1;

    btnPrev.disabled = (currentPage <= 1);
    btnNext.disabled = (currentPage >= metadata.totalPages);
}

/**
 * Hilfsfunktion zur Aktualisierung von Liste und Karte (erwartet nun das Server-Response-Objekt)
 */
function updateView(responseObject) {
    // Da der Server nun ein Objekt liefert, entpacken wir geotags und metadata
    const tagList = responseObject.geotags || [];
    const metadata = responseObject.metadata;

    // 1. Liste im Discovery-Bereich aktualisieren
    var discoveryResults = document.getElementById("discoveryResults");
    if (discoveryResults) {
        discoveryResults.innerHTML = ""; 

        tagList.forEach(function(tag) {     
            var li = document.createElement("li");
            li.innerHTML = tag.name + " (" + tag.latitude + ", " + tag.longitude + ") " + (tag.hashtag || "");
            discoveryResults.appendChild(li);
        });
    }

    // 2. Karten-Marker updaten
    var latInput = document.getElementById("latitude-Discovery");
    var lonInput = document.getElementById("longitude-Discovery");
    
    if (window.mapManager && latInput && lonInput) {        
        window.mapManager.updateMarkers(latInput.value, lonInput.value, tagList);
    }

    // 3. UI-Buttons für Paging updaten
    if (metadata) {
        updatePaginationControls(metadata);
    }
}

function readTagForm () {
    var latitude = document.getElementById("latitude-Tagging").value;
    var longitude = document.getElementById("longitude-Tagging") ? document.getElementById("longitude-Tagging").value : "";
    var name = document.getElementById("name").value;
    var hashtag = document.getElementById("hashtag").value;

    if(!latitude || !longitude || !name ) return;

    return {
        name : name,
        latitude : parseFloat(latitude),
        longitude : parseFloat(longitude),
        hashtag : hashtag
    };
}

/**
 * Holt die Daten passend zur gewünschten Seite ab
 */
async function loadPage(page) {
    var lat = document.getElementById("latitude-Discovery").value;      
    var lon = document.getElementById("longitude-Discovery").value;
    var searchterm = document.getElementById("searchterm") ? document.getElementById("searchterm").value : "";

    var params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        searchterm: searchterm,
        page: page,
        per_page: perPage
    });

    try {
        var res = await fetch('/api/geotags?' + params.toString(), {
            method: "GET",                  
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            var data = await res.json();
            updateView(data);
        }
    } catch (error) {
        console.error("Fehler beim Laden der Seite:", error);
    }
}

async function handleDiscoveryForm() {
    // Nutzen wir nun direkt loadPage, fangen wir im Event-Listener ab
}

// DomContentLoaded Event-Listener
document.addEventListener("DOMContentLoaded", () => {           
    updateLocation();                                           

    const tagForm = document.getElementById("tag-form");                                
    const discoveryForm = document.getElementById("discoveryFilterForm");       

    if (tagForm) {
        tagForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!tagForm.checkValidity()) {
                tagForm.reportValidity();
                return;
            }

            var geotag = readTagForm();
            if (!geotag) return;

            try {
                var postResponse = await fetch("/api/geotags", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(geotag)
                });

                if (!postResponse.ok) throw new Error("GeoTag could not be saved.");

                // Nach dem Posten laden wir die Ansicht auf Seite 1 neu
                loadPage(1);
            } catch (error) {
                console.error("Fehler:", error);
            }
        });
    } 

    if (discoveryForm) {
        discoveryForm.addEventListener("submit", async (event) => {
            event.preventDefault();     
            // Bei einer neuen Filtersuche fangen wir immer wieder bei Seite 1 an
            loadPage(1);
        });
    }

    // Event-Listener für die neuen Pagination-Buttons registrieren
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            loadPage(currentPage + 1);
        });
    }
});