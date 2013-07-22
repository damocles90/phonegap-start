var cache = new LastFMCache();

var lastfm = new LastFM({
	apiKey : '29a13dc8ae98dae42d1e07b16ee6fa13',
	apiSecret : '052b76b43071b759767ab1946c1dbec6',
	cache : cache
});

function getVar(name)
{
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function setArtistImage(artist)
{
	lastfm.artist.getInfo({artist: artist}, {success: function (data){
		//console.log(data);
		var artistImage = data.artist.image[2]["#text"];
		$(".artistImage").attr('src', artistImage);
		console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getAlbumDiv(artist, album, image)
{
	var imgHtml = "<img src='" + image+"'";
	var labelHtml = "<p>"+ artist + "-" + album + "</p>";
	var linkHtml = "<a href='album_lastfm.html?artist="+ encodeURIComponent(artist)+"&album="+ encodeURIComponent(album)+ "'>"
					+imgHtml+labelHtml+"</a>";
	var ret = "<div class='artistAlbums'>" + linkHtml + "</div>";
	return ret;
}

function getAlbums(artist, limit)
{
	lastfm.artist.getTopAlbums({artist: artist}, {success: function (data){
		console.log(data);
		var albums = data.topalbums.album;
		var length = Math.min(limit, albums.length);
		
		//console.log($("#Albums").text());
		for(var ii = 0; ii < length; ii++)
		{
			var album = albums[ii];
			var albumArtist = album.artist.name;
			var albumName = album.name;
			var albumImg = album.image[1]["#text"];
			var albumDiv = getAlbumDiv(albumArtist, albumName, albumImg);
			console.log(albumDiv);
			
			$("#albumsContainer").append(albumDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

$(function(){
	var artist = getVar('artist');
	$(".artistName").text(artist);
	setArtistImage(artist);
	getAlbums(artist, 5);
});