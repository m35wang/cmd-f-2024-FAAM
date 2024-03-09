const script = document.createElement('script');
script.scr = "https:??maps.googleapis.com/maps/api/js?key=AIzaSyAbauG84e4IlL78ZiAmnx0DpcFiowviJKs";
document.head.appendChild(script);

function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 }
    });
    
    const marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map
    });
}