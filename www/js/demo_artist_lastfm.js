var cache = new LastFMCache();

var lastfm = new LastFM({
	apiKey : '29a13dc8ae98dae42d1e07b16ee6fa13',
	apiSecret : '052b76b43071b759767ab1946c1dbec6',
	cache : cache
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
	var linkHtml = "<a href='artist_lastfm.html?artist="+ encodeURIComponent(name)+"'>"+imgHtml+labelHtml+"</a>";
	var ret = "<div class='relatedArtist'>" + linkHtml + "</div>";
	return ret;
}

function setArtistImage(artist)
{
	lastfm.artist.getInfo({artist: artist}, {success: function (data){
		//console.log(data);
		alert(data);
		var artistImage = data.artist.image[2]["#text"];
		$(".artistImage").attr('src', artistImage);
		console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getRelated(artist, limit)
{
	lastfm.artist.getSimilar({artist: artist}, {success: function (data){
		console.log(data);
		var relatedArtists = data.similarartists.artist;
		var length = Math.min(limit, relatedArtists.length);
		
		console.log($("#relatedArtistContainer").text());
		for(var ii = 0; ii < length; ii++)
		{
			var related = relatedArtists[ii];
			var relatedName = related.name;
			var relatedImg = related.image[1]["#text"];
			var relatedDiv = getArtistDiv(relatedName, relatedImg);
			console.log(relatedDiv);
			
			$("#relatedArtistContainer").append(relatedDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}})
}

$('#artistPage').live('pageshow', function(event){
	
	/*$.getJSON("https://api.twitter.com/1/help/test.json?callback=?", {}).done(function(data){
		alert(data);
	}).fail(function (data){
		alert(JSON.stringify(data));
	});*/
	
	$.getJSON("http://blogname.tumblr.com/api/read/json?num=2&callback=?", {format: "jsonp"}).done(function(data){
		alert("data: "+ data)
	});
	
	alert("Page ready");
	
	var artist = getVar('artist');
	$(".artistName").text(artist);
	$(".artist_album_link").attr("href", "artist_albums_lastfm.html?artist="+artist+"");
	
	
	setArtistImage(artist);
	getRelated(artist, 5);
});