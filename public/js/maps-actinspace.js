var iconBase = 'http://localhost:9000/public/img/';
var icons = {
    redpin: {
        icon: iconBase + 'redpin.png'
    },
    greenpin: {
        icon: iconBase + 'greenpin.png'
    }
};
var building;

let buildingDatas = [];
let markers = [];
function getData() {
    const req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                building = JSON.parse(this.responseText)
                buildingDatas = building["Values"];
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
    // if mouse is down, stop all updates
    if ( chart.mouseDown )
        return;

    let random  = getRandomArbitrary(-0.00001, 0.00001);
    let i = 0;
    maindate.setDate(maindate.getDate() + 1);
    while(i < buildingDatas.length){
        let random2  = getRandomArbitrary(-0.1, 0.1);
        if (buildingDatas[i]["Deformation"] + random2 > 0.08 ||buildingDatas[i]["Deformation"] + random2 < -0.08) {
          markers[i].setIcon(icons.redpin.icon)
        }
        chart.dataSets[i].dataProvider.push({"value": buildingDatas[i]["Deformation"] + random2, "date": maindate});
        markers[i].setPosition(new google.maps.LatLng({lat:buildingDatas[i]["Position"]["Lat"] + random, lng: buildingDatas[i]["Position"]["Lng"] + random}));
        i++;
    }
    chart.validateData();
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
    generateChartData();
    setInterval(function (map) { updatepos(map) }, 3000);
}

/**
 * Create the chart
 */
var chart = AmCharts.makeChart( "chartdiv", {
    "type": "stock",
    "theme": "light",

    // This will keep the selection at the end across data updates
    "glueToTheEnd": true,

    // Defining data sets
    // Panels
    "dataSets": [],
    "panels": [ {
        "showCategoryAxis": true,
        "title": "Value",
        "stockGraphs": [ {
            "id": "g1",
            "valueField": "value",
            "comparable": true,
            "compareField": "value"
        } ],
        "stockLegend": {}
    } ],
    "valueAxesSettings" : {
        "minimum": 0,
        "maximum": 1,
        "gridCount": 10
    },

    // Scrollbar settings
    "chartScrollbarSettings": {
        "graph": "g1",
        "usePeriod": "WW"
    },

    // Period Selector
    "periodSelector": {
        "position": "left",
        "periods": [ {
            "period": "DD",
            "count": 10,
            "label": "10 days"
        }, {
            "period": "MM",
            "selected": true,
            "count": 1,
            "label": "1 month"
        }, {
            "period": "YYYY",
            "count": 1,
            "label": "1 year"
        }, {
            "period": "YTD",
            "label": "YTD"
        }, {
            "period": "MAX",
            "label": "MAX"
        } ]
    },

    // Data Set Selector
    "dataSetSelector": {
        "position": "left"
    },

    // Event listeners
    "listeners": [ {
        "event": "rendered",
        "method": function( event ) {
            chart.mouseDown = false;
            chart.containerDiv.onmousedown = function() {
                chart.mouseDown = true;
            }
            chart.containerDiv.onmouseup = function() {
                chart.mouseDown = false;
            }
        }
    } ]
} );

var maindate = new Date();
maindate.setDate( maindate.getDate() - 500 );
maindate.setHours( 0, 0, 0, 0 );

function generateChartData() {
    let i = 0;
    while(i < buildingDatas.length){
        let chartdatasets = [];
        chartdatasets.push({"value": buildingDatas[i]["Deformation"], "date": maindate});
        let dataset = new AmCharts.DataSet();
        dataset.title = building["Name"] + " - Point n°" + i;
        dataset.dataProvider = chartdatasets;
        dataset.categoryField = "date";
        for ( i1 in chart.panels ) {
            for ( i2 in chart.panels[ i1 ].stockGraphs ) {
                var valueField = chart.panels[ i1 ].stockGraphs[ i2 ].valueField;
                dataset.fieldMappings.push( {
                    "fromField": valueField,
                    "toField": valueField
                } );
            }
        }
        chart.dataSets.push(dataset);
        i = i+1;
    }

    chart.validateData();
}



getData();