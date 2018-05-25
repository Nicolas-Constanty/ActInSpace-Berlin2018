

function getData() {
    const req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                var json = JSON.parse(this.responseText);
                initMap(json)
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };
    req.open('GET', 'http://localhost:9000/initial_value', true);
    req.send(null);
}

function initMap(jsonValue) {
  var uluru = {lat: 52.5154472, lng: 13.323786};
  var markerTabs = [];


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru,
      disableDefaultUI: true,
      mapTypeId: 'satellite'
    });

    var i = 0;
    while(i < jsonValue["Values"].length){
        var pos = {lng: jsonValue["Values"][i]["Position"]["Lng"], lat: jsonValue["Values"][i]["Position"]["Lat"]};
         markerTabs.push(new google.maps.Marker({
             position: pos,
             map: map
         }));
        i++;
    }
    i = 0;


};
