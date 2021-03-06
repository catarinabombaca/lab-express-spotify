require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    (data) => {
          console.log("Tracks:", data.body);
          const tracks = data.body.items;
           res.render("tracks", { tracks });
    },
    (err) => {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(
      (data) => {
            console.log("Artist albums", data.body);
            const albums = data.body.items;
             res.render("albums", { albums });
      },
      (err) => {
        console.error(err);
      }
    );
});

app.get("/artist-search", (request, response, next) => {
  spotifyApi
    .searchArtists(request.query.name)
    .then((data) => {
      const artists = data.body.artists.items;
      console.log(artists[0].images)
      response.render("artist", {artists});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/", (request, response, next) => {
  response.render("home");
});

app.listen(process.env.PORT, () =>
  console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`)
);
