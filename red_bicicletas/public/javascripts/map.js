var mymap = L.map('mapid').setView([-34.8833, -56.1667], 34);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 16,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2VyZ2lvMzk5NiIsImEiOiJja3F0bmdvYngwZTRtMm5zYjI4dnh6MTU3In0.47qENvCQO-NF60-BbZ2V4A'
}).addTo(mymap);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result)
        result.bicicletas.forEach(function(bici) {
            L.marker(bici.ubicacion, {title: bici.id}).addTo(mymap);
        })
    }
})