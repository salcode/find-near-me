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

	function NearestFeature(latitude, longitude, features) {
		var mindif = 99999;
		var closest;

		for (index = 0; index < features.length; ++index) {
			var dif = LatLngDist(latitude, longitude, features[index].geometry.coordinates[1], features[index].geometry.coordinates[0]);
			if (dif < mindif) {
				closest = index;
				mindif = dif;
			}
		}

		props = features[closest].properties;

		output.textContent =
			props.FACILITY_NAME + " (" + props.FACILITY_OR_OFFICE_OR_AGENCY + ")\n"
			+ props.ADDRESS_1 + "\n"
			+ props.CITY + ", " + props.STATE + " " + props.ZIP + "\n"
			+ props.PHONE + "\n\n"
			+ "approximately " + Math.round( dif ) + " miles away";
	}

	/**
	 * Use results of geolocation.
	 */
	function geolocationSuccess( position ) {

		// Load list of locations as xobj.
		var xobj = new XMLHttpRequest();

		// Update button text.
		geolocateBtn.textContent='Using your location...';


		// Specify MIME type other than the one provided by the server.
		// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType
		xobj.overrideMimeType("application/json");

		xobj.open( 'GET', 'js/places_geo.geojson', true );

		xobj.onreadystatechange = function () {
			if ( xobj.readyState != 4 ) {
				// The operation is NOT complete.
				// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
				return;
			}
			if ( xobj.status != "200" ) {
				// Failure.
				output.textContent = "Unable to load locations. Please try again later.";
				return;
			}
			// Successfully loaded data.
			var nearest = NearestFeature(
				position.coords.latitude,
				position.coords.longitude,
				JSON.parse( xobj.responseText ).features
			);
    };

		xobj.send(null);

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
