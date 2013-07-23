var cache = new LastFMCache();

var lastfm = new LastFM({
	apiKey : '29a13dc8ae98dae42d1e07b16ee6fa13',
	apiSecret : '052b76b43071b759767ab1946c1dbec6',
	cache : cache
});

//A player using the iTunesPreviewPlayer but adding track and artist name
var StyledPlayer = function(term) {
  // Create an iTunesPreviewPlayer
  this._player = new iTunesPreviewPlayer(term);
  // Delegate called when the player is loaded
  // Use this to get access to artist and track name
  this._player.onLoaded = function() {
    if(!this._player.isError()) {
      this._artistNameElement.innerHTML = this._player.artistName();
      this._trackNameElement.innerHTML = this._player.trackName();
    }
    else {
      this._artistNameElement.innerHTML = 'Sorry!';
      this._trackNameElement.innerHTML = 'Track not found';
    }
  }.bind(this);

  // Create UI
  this._DOMElement = document.createElement('div');
  this._DOMElement.classList.add('styledPlayer');
  this._DOMElement.appendChild(this._player.DOMElement());

  this._artistNameElement = document.createElement('div');
  this._artistNameElement.classList.add('artist');
  this._artistNameElement.innerHTML = 'Please wait';
  this._DOMElement.appendChild(this._artistNameElement);

  this._trackNameElement = document.createElement('div');
  this._trackNameElement.classList.add('track');
  this._trackNameElement.innerHTML = 'Loading…';
  this._DOMElement.appendChild(this._trackNameElement);

  this.DOMElement = function() {
    return this._DOMElement;
  }
}

function createTrackPlayer(track)
{
	var player = new StyledPlayer(track.toLowerCase());
	return player.DOMElement();
}

function getVar(name)
{
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function setAlbumImage(artist, album)
{
	lastfm.album.getInfo({artist: artist, album: album}, {success: function (data){
		//console.log(data);
		var albumImage = data.album.image[2]["#text"];
		$(".albumImage").attr('src', albumImage);
		//console.log(artistImage);
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getTrackDiv(artist, name, duration)
{
	var trackHtml = createTrackPlayer(artist + " " + name);
	console.log(trackHtml);
	var labelHtml = "<p><span>"+ name + "</span><span>\t" + secondsToTrackTimeFormat(duration) + "</span></p>";
	var ret = "<div class='artistAlbums'>" + labelHtml + "</div>";
	return trackHtml;
}

function secondsToTrackTimeFormat(secs)
{
	var mins = parseInt(secs / 60);
	var leftSecs = secs - (mins * 60);
	
	var minStr = mins > 9 ? "" + mins : "0"+ mins;
	var leftSecStr = leftSecs > 9 ? "" + leftSecs :  "0" + leftSecs;
	return minStr + ":" + leftSecStr;
}

function getTracks(artist, album)
{
	lastfm.album.getInfo({artist: artist, album: album}, {success: function (data){
		console.log(data);
		var tracks = data.album.tracks.track;
		var length = tracks.length;
		
		//console.log($("#Albums").text());
		for(var ii = 0; ii < length; ii++)
		{
			var track = tracks[ii];
			var trackName = track.name;
			var trackDuration = track.duration;
			var trackDiv = getTrackDiv(artist, trackName, trackDuration);
			console.log(trackDiv);
			
			$("#tracksContainer").append(trackDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

$('#albumPage').live("pageshow", function(){
	var artist = getVar('artist');
	var album = getVar('album');
	$(".albumName").text(artist + "-" + album);
	setAlbumImage(artist, album);
	getTracks(artist, album);
});