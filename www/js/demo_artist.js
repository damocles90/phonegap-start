//var cache = new LastFMCache();

/*var lastfm = new LastFM({
	apiKey : '29a13dc8ae98dae42d1e07b16ee6fa13',
	apiSecret : '052b76b43071b759767ab1946c1dbec6',
	cache : cache
});*/

var sevenDigital = new SevenDigital({
	apiKey : '7dhtmjkgv2qz',
	apiSecret : 'wz2j3zp2uugu5xvz'
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getVar(name)
{
	return getUrlVars()[name];
}

function getArtistDiv(name, image)
{
	var imgHtml = "<img src='" + image+"'";
	var labelHtml = "<p>" + name + "</p>";
	var linkHtml = "<a href='artist.html?artist="+ encodeURIComponent(name)+"'>"+imgHtml+labelHtml+"</a>";
	var ret = "<div class='relatedArtist'>" + linkHtml + "</div>";
	return ret;
}

function loadArtist(name)
{
	sevenDigital.artist.search({q: name}, {success: function (data){
		console.log(data);
		var foundArtist = data.searchResult[0].artist;
		$(".artistName").text(foundArtist.name);
		$(".artist_album_link").attr("href", "artist_albums.html?artistId="+foundArtist._id);
		setArtistImage(foundArtist);
		getRelated(foundArtist, 5);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function setArtistImage(artist)
{
	sevenDigital.artist.details({artistId: artist._id}, {success: function (data){
		
		console.log(data);
		var artistImage = data.image;
		$(".artistImage").attr('src', artistImage);
		//console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getRelated(artist, limit)
{
	sevenDigital.artist.similar({artistId: artist._id}, {success: function (data){
		console.log(data);
		var relatedArtists = data.artist;
		var length = Math.min(limit, relatedArtists.length);
		
		console.log($("#relatedArtistContainer").text());
		for(var ii = 0; ii < length; ii++)
		{
			var related = relatedArtists[ii];
			var relatedName = related.name;
			var relatedImg = related.image;
			var relatedDiv = getArtistDiv(relatedName, relatedImg);
			console.log(relatedDiv);
			
			$("#relatedArtistContainer").append(relatedDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}})
}

alert('bar');
$('#artistPage').live('pageshow', function(event){
	
	
	var name = getVar('artist');
	//name = name? name: 'Cher';
	alert("name: " + name);
	
	var myMedia = new Media("http://a396.phobos.apple.com/us/r1000/091/Music/42/42/e0/mzm.zqkoctwq.aac.p.m4a",function(){}, false);
	
	alert(myMedia);
	console.log(name);
	loadArtist(name);
	//setArtistImage(artist);
	//getRelated(artist, 5);
});