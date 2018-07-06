function LatLngDist( lat1, lng1, lat2, lng2 ) {
	// @see https://stackoverflow.com/questions/21279559/geolocation-closest-locationlat-long-from-my-position.

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
