function initMap() {
    var mapOptions = {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 },
        // Additional map options can be defined here
    };

    // Create a new map instance
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Additional map functionality (like markers) can be added here
}

// Load the Google Maps API script dynamically
function loadGoogleMapsApi() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAbauG84e4IlL78ZiAMnxODpcFiowviJKs&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Call the function to load the Google Maps API
loadGoogleMapsApi();
