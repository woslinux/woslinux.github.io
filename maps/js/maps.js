'use strict';

document.addEventListener('DOMContentLoaded', function() {
  let kantorPusat = [106.8418796, -6.2516778];
  var x = document.getElementById("map");
  var latitude = document.getElementById("lat");
  var longitude = document.getElementById("long");
  const iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(kantorPusat)),
    name: 'Kisel'
  });

  const iconFeature2 = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([106.7352587, -6.1690892])),
    name: 'Kisel'
  });

  var view = new ol.View({
    center: ol.proj.fromLonLat(kantorPusat),
    zoom: 16
  });
  var locationStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.75,
      src: 'https://openlayers.org/en/latest/examples/data/icon.png'
    })
  });

  var locationCircle = new ol.Feature();
  var currentLocation = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [locationCircle]
    }),
    style: locationStyle
  });

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [iconFeature]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'kisel-logo.png',
            scale: 0.2
          })
        })
      })
    ],
    view: view
  });

  var geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    //tracking: true,
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: map.getView().getProjection()
  });

  function el(id) {
    return document.getElementById(id);
  }

  el('track').addEventListener('change', function() {
    console.log("dipencet");
    geolocation.setTracking(this.checked);
  });

  // handle geolocation error.
  geolocation.on('error', function(error) {
    var info = document.getElementById('info');
    info.innerHTML = error.message;
    info.style.display = '';
  });

  var accuracyFeature = new ol.Feature();
  geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  });

  var positionFeature = new ol.Feature();

  geolocation.on('change:position', function(evt) {
    var coordinates = geolocation.getPosition();
    var speed = geolocation.getSpeed();
    var altitude = geolocation.getAltitude();
    var heading = geolocation.getHeading();

    map.getView().setCenter(coordinates);
    console.log(coordinates);
    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates)
    });
    var vectorSource = new ol.source.Vector({
      features: [iconFeature]
    });
    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        scale: 1,
        src: 'user-location.png'
      }))
    });
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: iconStyle
    });
    map.addLayer(vectorLayer);
    ambilLokasi();
  });

  function ambilLokasi() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(liatPosisi);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function liatPosisi(position) {
    latitude.style.display = "block";
    longitude.style.display = "block";
    latitude.innerHTML = position.coords.latitude;
    longitude.innerHTML = position.coords.longitude;
    var from = kantorPusat;
    var to = [position.coords.longitude, position.coords.latitude];
    console.log(position.coords.longitude);
    console.log(position.coords.latitude);

    var options = {
      units: 'kilometers'
    };
    var distance = turf.distance(to, from, options);
    var value = document.getElementById('jarak');
    value.style.display = "block";
    value.innerHTML = "Jarak dari kantor ke lokasi Anda: " + distance.toFixed([2]) + " km";
  }

  new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [accuracyFeature, positionFeature]
    })
  });


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    new ol.Geolocation({
      projection: map.getView().getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true
      }
    }).on('change', function() {
      var lonLat = this.getPosition();
      var speed = this.getSpeed();
      var altitude = this.getAltitude();
      var heading = this.getHeading();

      map.getView().setCenter(lonLat);

      console.log(lonLat);
      var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(lonLat)
      });
      var vectorSource = new ol.source.Vector({
        features: [iconFeature]
      });
      var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          scale: 1,
          src: 'user-location.png'
        }))
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle
      });
      map.addLayer(vectorLayer)
    });
    latitude.style.display = "block";
    longitude.style.display = "block";
    latitude.innerHTML = position.coords.latitude;
    longitude.innerHTML = position.coords.longitude;
    var from = kantorPusat;
    var to = [position.coords.longitude, position.coords.latitude];

    var options = {
      units: 'kilometers'
    };
    var distance = turf.distance(to, from, options);
    var value = document.getElementById('jarak');
    value.style.display = "block";
    value.innerHTML = "Jarak dari kantor ke lokasi Anda: " + distance.toFixed([2]) + " km";
  }
});
