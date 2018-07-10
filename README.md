# Find Near Me

This functionality is for the [Encuentra](https://encuentra.us/) project.

If the current browser supports Geolocation, the user is presented with a "Use my location" button.

When this button is clicked, the user's latitude and longitude are determined.  This information is then compared with the data in `places_geo.geojson`, which is data originally from `https://projects.propublica.org/graphics/data/migrant-shelters-near-you/places_geo.geojson`.

The closest location in `places_geo.geojson` is then displayed.

## Deployment Information

This code can be deployed on a website by adding the following HTML (which loads the necessary JavaScript and CSS from the remote server).

```
<div class="encuentra-migrant-shelter-call-to-action">
	<h2>Find an Immigrant Children’s Shelter Near You</h2>
	<h2><em>Encuentra un refugio para inmigrantes cerca de ti</em></h2>
	<div id="encuentra-hidden-unless-able-to-geolocate">
		<pre id="encuentra-output"><code></code></pre>

		<p>
		Click the button below to find a location near you.<br>
		<em>Haga clic en el botón de abajo para encontrar una ubicación cerca de usted.</em><br>
		<button id="encuentra-use-my-location">Use my location</button>
	</div>
	<link rel="stylesheet" href="css/style.css">
	<script src="js/app.js"></script>
</div>
```

## Updating places_geo.geojson

The latest copy of `places_geo.geojson` can be retrieved by

moving to the `js` directory

```
cd js
```

and running the following from the command line.

```
curl -O https://projects.propublica.org/graphics/data/migrant-shelters-near-you/places_geo.geojson
```

This updated file should then be made available at `https://encuentra.us/find-near-me/js/places_geo.geojson`.

## Initial Setup

When initially setting up this project, it is important `https://encuentra.us/find-near-me/js/places_geo.geojson` is served with the following response header.

```
access-control-allow-origin: *
```

This allows any website to load this file and use it.

On a server running Apache, this header can be added via an `.htaccess` file in the directory with the following content.

```
# Serve any file ending in `.geojson` with the
# wildcard Access-Control-Allow-Origin header.
<FilesMatch "\.(geojson)$">
	<IfModule mod_headers.c>
		Header set Access-Control-Allow-Origin "*"
	</IfModule>
</FilesMatch>
```

