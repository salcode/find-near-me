(function() {
	var isGeolocationAvailable = "geolocation" in navigator,
		geolocateBtn = document.getElementById('use-my-location'),
		output = document.getElementById('output');

	if ( ! isGeolocationAvailable ) {
		output.textContent = 'Geolocation is not available on this device.';
		// Stop here.
		return;
	}

	// Reveal Geolocation Button.
	geolocateBtn.style.display = 'inline-block';

	// Listen for Gelocation Button click.
	geolocateBtn.addEventListener( 'click', function( event ) {
		// Disable button to prevent further clicks.
		geolocateBtn.disabled=true;

		geolocateBtn.textContent='Finding your location...';

		// Perform geolocation.
		navigator.geolocation.getCurrentPosition(
			geolocationSuccess, geolocationError, {}
		);

	} );

	function coordsToText( coords ) {
		// @see https://developer.mozilla.org/en-US/docs/Web/API/Coordinates.
		return "Latitude: " + coords.latitude +
			"\nLongitude: " + coords.longitude +
			"\nAltitude: " + coords.altitude +
			"\nAccuracy: " + coords.accuracy +
			"\nAltitudeAccuracy: " + coords.altitudeAccuracy +
			"\nHeading: " + coords.heading +
			"\nSpeed: " + coords.speed;
	}

	/**
	 * Display results of geolocation.
	 */
	function geolocationSuccess( position ) {
		// Display results of geolocation.
		output.textContent = coordsToText( position.coords );

		// Hide Geolocate Button.
		geolocateBtn.style.display = 'none';
	}

	/**
	 * Display geolocation error.
	 */
	function geolocationError( err ) {
		output.textContent = "Error(" + err.code + "): " + err.message;
	}

})();
