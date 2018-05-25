function initMap() {
  var uluru = {lat: 52.5154472, lng: 13.323786};
  var markerTabs = [];
  var jsonString = 1;
  var jsonValue = JSON.parse(jsonString);

  var positions = [
    {lat:52.5154472, lng:13.323786},
    {lat:52.515136, lng:13.323390},
    {lat:52.515488, lng: 13.323957},
    {lat:52.515196, lng: 13.324041},
    {lat:52.515110, lng: 13.324053},
    {lat:52.514657, lng: 13.324149},
    {lat:52.514625, lng: 13.323871},
    {lat:52.514830, lng: 13.323814},
    {lat:52.514808, lng: 13.323482},
    {lat:52.514603, lng: 13.323497},
    {lat:52.514587, lng: 13.323263},
    {lat:52.514920, lng: 13.323214}];

  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru,
      disableDefaultUI: true,
      mapTypeId: 'satellite'
    });
  var i = 0;
  while(i < positions.length){
    markerTabs.push(new google.maps.Marker({
      position: positions[i],
      map: map
    }));
    i++;
    }
  i = 0;
  // var i = 0;
  // while(i < jsonValue.Values.length){
  //   markerTabs.push(new google.maps.Marker({
  //     position: jsonValue.position[i],
  //     map: map
  //   }));
  //   i++;
  //   }
  // i = 0;
};
