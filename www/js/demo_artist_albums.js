
var sevenDigital = new SevenDigital({
	apiKey : '7dhtmjkgv2qz',
	apiSecret : 'wz2j3zp2uugu5xvz'
});

function getVar(name)
{
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function loadArtistAlbums(artistId)
{
	sevenDigital.artist.details({artistId: artistId}, {success: function (data){
		console.log(data);
		$(".artistName").text(data.name);
		var artistImage = data.image;
		$(".artistImage").attr('src', artistImage);
		getAlbums(artistId, 5);
		//console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
	
}

function setArtistImage(artist)
{
	sevenDigital.artist.getInfo({artist: artist}, {success: function (data){
		//console.log(data);
		var artistImage = data.artist.image[2]["#text"];
		$(".artistImage").attr('src', artistImage);
		console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getAlbumDiv(album)
{
	var imgHtml = "<img src='" + album.image+"'";
	var labelHtml = "<p>"+ album.artist.name + "-" + album.title + "</p>";
	var linkHtml = "<a href='album.html?albumId="+ encodeURIComponent(album._id) + "'>"
					+imgHtml+labelHtml+"</a>";
	var ret = "<div class='artistAlbums'>" + linkHtml + "</div>";
	return ret;
}

function getAlbums(artistId, limit)
{
	sevenDigital.artist.releases({artistId: artistId, type: 'album'}, {success: function (data){
		console.log(data);
		var albums = data.release;
		var length = Math.min(limit, albums.length);
		
		//console.log($("#Albums").text());
		for(var ii = 0; ii < length; ii++)
		{
			var album = albums[ii];
			var albumDiv = getAlbumDiv(album);
			console.log(albumDiv);
			
			$("#albumsContainer").append(albumDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

$(function(){
	var artistId = getVar('artistId');
	loadArtistAlbums(artistId);
});