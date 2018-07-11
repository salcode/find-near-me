# Find Near Me

**Version**: `0.1.3`

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

		<div id="encuentra-hide-when-complete">
			<p>
			Click the button below to find a location near you.<br>
			<em>Haga clic en el botón de abajo para encontrar una ubicación cerca de usted.</em><br>
			<br>
			<button id="encuentra-use-my-location" data-locations-uri="https://s3.amazonaws.com/encuentra/places_geo.geojson">Use my location</button>
		</div>
	</div>
	<link rel="stylesheet" href="https://encuentra.us/find-near-me/css/style.css?v=0.1.0">
	<script src="https://encuentra.us/find-near-me/js/app.js?v=0.1.0"></script>
</div>
```

## Updating places_geo.geojson

The latest copy of `places_geo.geojson` can be retrieved with

```
curl -O https://projects.propublica.org/graphics/data/migrant-shelters-near-you/places_geo.geojson
```

This updated file should then be moved to the Amazon S3 bucket at `https://s3.amazonaws.com/encuentra/places_geo.geojson`.

## Initial Setup

When initially setting up this project, it is important `https://s3.amazonaws.com/encuentra/places_geo.geojson` is served with the following response header.

```
access-control-allow-origin: *
```

This allows any website to load this file and use it. Configuring this varies depending on the web server running the website. Typically, it is either Apache or nginx.

### Apache Server Configuration

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

### nginx Server Configuration

On a server running nginx, first locate the nginx configuration file for the relevant site (in Local by Flywheel this is at `conf/nginx/site.conf`).

Inside the `server` block, add the following

```
location /find-near-me/js/places_geo.geojson {
    add_header Access-Control-Allow-Origin *;
}
```

### Amazon S3

See Amazon S3 [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) documentation.

This is the CORS configuration currently on our S3 bucket.

```
<CORSConfiguration>
	<CORSRule>
		<AllowedOrigin>*</AllowedOrigin>
		<AllowedMethod>GET</AllowedMethod>
		<MaxAgeSeconds>3000</MaxAgeSeconds>
	</CORSRule>
</CORSConfiguration>
```
