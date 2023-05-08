mapboxgl.accessToken = "pk.eyJ1IjoianVubWtpbSIsImEiOiJjbGgzcHQwdXAwM2pwM2tvZnA5NTdldzA4In0.HxjMS_y_zJ-MG_Q4-uf9ew";

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/junmkim/clhdzezcc00al01p688h81qgw',
  zoom: 10,
  center: [-74, 40.725],
  maxZoom: 15,
  minZoom: 8,
  maxBounds: [[-74.45, 40.45], [-73.55, 41]]
});

map.on('load', function () {
  // This is the function that finds the first symbol layer
  let layers = map.getStyle().layers;
  let firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    console.log(layers[i].id);
      if (layers[i].type === 'symbol') {
          firstSymbolId = layers[i].id;
          break;
      }
  }

  map.addLayer({
      'id': 'MTA Station Data',
      'type': 'circle',
      'source': {
          'type': 'geojson',
          'data': 'data/turnstileData.geojson'
      },
      'paint': {
        'circle-color': ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, '#dd1c77',
                -0.7, '#c994c7',
                -0.4, '#e7e1ef'
        ],
        'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
            10, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, 7,
                -0.4, 1
            ],
            15, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, 20,
                -0.4, 10
            ]
        ],
        'circle-opacity': 0.85,
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 0.6
      }
  }, firstSymbolId);

  map.addLayer({
    'id': 'Household Income Data',
    'type': 'fill',
    'source': {
        'type': 'geojson',
        'data': 'data/medianIncome.geojson'
    },
    'paint': {
      'fill-color': ['step', ['get', 'MHHI'],
          '#ffffff',
          20000, '#f0f9e8',
          50000, '#bae4bc',
          75000, '#7bccc4',
          100000, '#43a2ca',
          150000, '#0868ac'],
      'fill-opacity': ['case', ['==', ['get', 'MHHI'], null], 0, 0.65]
    }
  }, 'waterway');
});

// Create the popup
map.on('click', 'turnstileData', function (e) {
  let entriesDiff = e.features[0].properties.ENTRIES_DIFF;
  let entries_06 = e.features[0].properties.ENTRIES_06;
  let entries_20 = e.features[0].properties.ENTRIES_20;
  let stationName = e.features[0].properties.stationName;
  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h4>' + stationName + '</h4>'
          + '<p><b>Friday, March 6th:</b> ' + entries_06 + ' entries<br>'
          + '<b>Friday, March 20th:</b> ' + entries_20 + ' entries<br>'
          + '<b>Change:</b> ' + Math.round(entriesDiff * 1000) / 10 + '%</p>')
      .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on('mouseenter', 'turnstileData', function () {
  map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'turnstileData', function () {
  map.getCanvas().style.cursor = '';
});

// var toggleableLayerIds = ['MTA Station Data', 'Household Income Data'];


// for (var i = 0; i < toggleableLayerIds.length; i++) {
//     var id = toggleableLayerIds[i];

//     var link = document.createElement('a');
//     link.href = '#';
//     link.className = 'active';
//     link.textContent = id;

//     link.onclick = function(e) {
//         var clickedLayer = this.textContent;
//         e.preventDefault();
//         e.stopPropagation();

//         var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

//         if (visibility === 'visible') {
//             map.setLayoutProperty(clickedLayer, 'visibility', 'none');
//             this.className = '';
//         } else {
//             this.className = 'active';
//             map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
//         }
//     };

//     var layers = document.getElementById('menu');
//     layers.appendChild(link);
// }