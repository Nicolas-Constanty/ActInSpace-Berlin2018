var iconBase = 'http://localhost:9000/public/img/';
var icons = {
    redpin: {
        icon: iconBase + 'redpin.png'
    },
    greenpin: {
        icon: iconBase + 'greenpin.png'
    }
};

let buildingDatas = [];
let markers = [];
function getData() {
    const req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                buildingDatas = JSON.parse(this.responseText)["Values"];
                initgmap();
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };
    req.open('GET', 'http://localhost:9000/initial_value', true);
    req.send(null);
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function updatepos(map) {
    let random  = getRandomArbitrary(-0.00001, 0.00001);
    let i = 0;
    console.log(buildingDatas[0]["Position"]["Lat"] + random);
    while(i < buildingDatas.length){
        let random2  = getRandomArbitrary(-0.1, 0.1);
        if (buildingDatas[i]["Deformation"] + random2 > 0.08 ||buildingDatas[i]["Deformation"] + random2 < -0.08) {
          markers[i].setIcon(icons.redpin.icon)
        }
        markers[i].setPosition(new google.maps.LatLng({lat:buildingDatas[i]["Position"]["Lat"] + random, lng: buildingDatas[i]["Position"]["Lng"] + random}));
        i++;
    }
}

function initMapi() {
    let origin = new google.maps.LatLng(52.5154472, 13.323786);
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: origin,
        disableDefaultUI: true,
        mapTypeId: 'satellite'
    });
    return map;
}

function initMarker(map)
{
    let i = 0;
    while(i < buildingDatas.length){
        let latlng = new google.maps.LatLng({lat: buildingDatas[i]["Position"]["Lat"], lng: buildingDatas[i]["Position"]["Lng"]});
        let marker = new google.maps.Marker({ position: latlng, icon: icons.greenpin.icon });
        marker.setMap(map);
        markers.push(marker);
        i++;
    }
}

function initgmap() {
    let gmap = initMapi();
    initMarker(gmap);
    setInterval(function (map) { updatepos(map) }, 3000);
}

getData();
