// Define the URL of significant earthquakes in the past 7 days
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Use d3.json() to read the JSON file
d3.json(url).then((data) => {
  // Log the data to the console for inspection
  console.log(data);

  // Function to create a scaled legend
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depthRanges = [-10, 10, 30, 50, 70, 90]; // Depth ranges for the legend
    let colors = ['#98ee00', '#FFFF00', '#FFD700', '#FFA500', '#FF4500', '#DC143C'];
    let legendInfo = "<h4>Depth</h4>";

    // Iterate through each depth range to label and color the legend
    for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "; display: inline-block; width: 10px; height: 10px;'></i> " +
        depthRanges[i] + (depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Create the map
  let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let map = L.map("map").setView([0, 0], 2);
  baseMap.addTo(map);

  // Function to fetch and plot earthquake data on the map
  function plotEarthquakes(map) {
    // Loop through the earthquake data and add markers to the map
    data.features.forEach(feature => {
      const { coordinates } = feature.geometry;
      const [longitude, latitude, depth] = coordinates;
      const magnitude = feature.properties.mag;

      // Create a circle marker and add it to the map
      L.circleMarker([latitude, longitude], {
        radius: getMarkerSize(magnitude),
        color: getMarkerColor(depth),
        fillColor: getMarkerColor(depth),
        fillOpacity: 0.8
      })
        .addTo(map)
        .bindPopup(`Magnitude: ${magnitude}, Depth: ${depth} km`);
    });
  }

  // Function to calculate marker size based on magnitude
  function getMarkerSize(magnitude) {
    return magnitude * 2; // Adjust the multiplier for better visualization
  }

  // Function to calculate marker color based on depth
  function getMarkerColor(depth) {
    // Customize the color scale based on your preference
    if (depth > 90) return '#DC143C'; // Red-orange for deep earthquakes
    if (depth > 70) return '#FF4500'; // Dark orange for deep-moderate earthquakes
    if (depth > 50) return '#FFA500'; // Light orange for moderate earthquakes
    if (depth > 30) return '#FFD700'; // Dark yellow for moderate-light earthquakes
    if (depth > 10) return '#FFFF00'; // Light yellow for light-shallow earthquakes
    return '#98ee00'; // Light green for shallow earthquakes
  }

  // Add the legend to the map
  legend.addTo(map);

  // Call the function to plot the earthquakes
  plotEarthquakes(map);
});
