angular.module('weatherApp', [])
    .controller('WeatherController', function($scope, $http, $timeout) {
        var map;
        var marker;
        var weatherInfo = document.querySelector('.weather-info');

        // Initialize Leaflet map
        function initMap() {
            map = L.map('map').setView([0, 0], 2);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add click event listener to map
            map.on('click', function(event) {
                placeMarker(event.latlng);
                getWeatherData(event.latlng.lat, event.latlng.lng);
            });
        }

        // Place marker on the map
        function placeMarker(location) {
            if (marker) {
                marker.setLatLng(location);
            } else {
                marker = L.marker(location).addTo(map);
            }
            map.setView(location);
            toggleWeatherInfo(); // Show weather info when marker is placed
        }

        // Fetch weather data from WeatherAPI.com API
        function getWeatherData(lat, lon) {
            var apiKey = '7a981abc7f4f482b86d142711242602';
            var apiUrl = 'https://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + lat + ',' + lon + '&aqi=no';

            $http.get(apiUrl)
                .then(function(response) {
                    $scope.weatherData = response.data;
                    console.log('Weather data:', $scope.weatherData); // Log weather data to console
                // Fetch current time
                    var currentTime = new Date($scope.weatherData.location.localtime);
                    var hours = currentTime.getHours();
                    var minutes = currentTime.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle midnight
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var timeString = hours + ':' + minutes + ' ' + ampm;

                    // Update time in weather info
                    $scope.weatherData.time = timeString;
                })
                .catch(function(error) {
                    console.error('Error fetching weather data:', error);
                });
        }

        // Initialize Leaflet map when the page loads
        initMap();

        // Function to toggle weather info
        function toggleWeatherInfo() {
            weatherInfo.classList.add('active');
            $timeout(function() {
                weatherInfo.classList.remove('active');
            }, 5000); // Hide weather info after 5 seconds
        }
    });
