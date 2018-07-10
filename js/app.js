(function() {
	var isGeolocationAvailable = "geolocation" in navigator,
		geolocateControls = document.getElementById('encuentra-hidden-unless-able-to-geolocate'),
		hideWhenComplete = document.getElementById('encuentra-hide-when-complete'),
		geolocateBtn = document.getElementById('encuentra-use-my-location'),
		locationsUri = geolocateBtn.dataset.locationsUri,
		output = document.getElementById('encuentra-output');

	if ( ! isGeolocationAvailable ) {
		// Stop here. Geolocation is not available on this device.
		return;
	}

	// Reveal Geolocation Button.
	geolocateControls.style.display = 'block';

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

		output.style.display = 'block';
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

		xobj.open( 'GET', locationsUri, true );

		xobj.onreadystatechange = function () {
			if ( xobj.readyState != 4 ) {
				// The operation is NOT complete.
				// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
				return;
			}
			if ( xobj.status != "200" ) {
				// Failure.
				output.textContent = "Unable to load locations. Please try again later.";
				if ( 'undefined' !== typeof console && 'undefined' !== typeof console.error ) {
					console.error( 'Unable to load locations. Status: ' + xobj.status + ' ' + xobj.statusText );
				}
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

		// Hide Geolocate Button and message.
		hideWhenComplete.style.display = 'none';
	}

	/**
	 * Display geolocation error.
	 */
	function geolocationError( err ) {
		output.textContent = "Error(" + err.code + "): " + err.message;
	}

	function LatLngDist( lat1, lng1, lat2, lng2 ) {
		/**
		 * Example:
		 *
		 * LatLngDist( 40.3215666, -75.9828464, 33.5417647, -112.169801 )
		 *
		 * Result:
		 * 2036 miles (or 3277 km)
		 * @see https://stackoverflow.com/questions/21279559/geolocation-closest-locationlat-long-from-my-position.
		 */

		// Convert Degress to Radians
		function Deg2Rad(deg) {
			return deg * Math.PI / 180;
		}

		function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
			lat1 = Deg2Rad(lat1);
			lat2 = Deg2Rad(lat2);
			lon1 = Deg2Rad(lon1);
			lon2 = Deg2Rad(lon2);
			// var R = 6371; // km
			var R = 3959; // miles
			var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
			var y = (lat2 - lat1);
			var d = Math.sqrt(x * x + y * y) * R;
			return d;
		}

		return PythagorasEquirectangular( lat1, lng1, lat2, lng2 );
	}

})();
