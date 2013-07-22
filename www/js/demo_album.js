
var sevenDigital = new SevenDigital({
	apiKey : '7dhtmjkgv2qz',
	apiSecret : 'wz2j3zp2uugu5xvz'
});


//A player using the iTunesPreviewPlayer but adding track and artist name
var StyledPlayer = function(term) {
  // Create an iTunesPreviewPlayer
  this._player = new SevenDigitalPreviewPlayer(term);
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
	var player = new StyledPlayer(track);
	return player.DOMElement();
}

function getVar(name)
{
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function setAlbumImage(album)
{
		//console.log(data);
	var albumImage = album.image;
	$(".albumImage").attr('src', albumImage);
	//console.log(artistImage);
}

function getTrackDiv(track)
{
	var trackHtml = createTrackPlayer(track);
	console.log(trackHtml);
	var labelHtml = "<p><span>"+ track.title + "</span><span>\t" + secondsToTrackTimeFormat(track.duration) + "</span></p>";
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

function loadAlbum(albumId)
{
	sevenDigital.release.details({releaseId: albumId}, {success: function (data){
		//console.log(data);
			//console.log(related[ii]);
		
		$(".albumName").text(data.artist.name + "-" + data.title);
		$(".albumImage").attr('src', data.image);
		getTracks(albumId);
		
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

function getTracks(albumId)
{
	sevenDigital.release.tracks({releaseId: albumId}, {success: function (data){
		//console.log(data);
		
		var tracks = data.track;
		var length = tracks.length;
		
		//console.log($("#Albums").text());
		for(var ii = 0; ii < length; ii++)
		{
			var trackDiv = getTrackDiv(tracks[ii]);
			//console.log(trackDiv);
			
			$("#tracksContainer").append(trackDiv);
			//console.log(related[ii]);
		}
	}, error: function(code, message){
		alert(code +": " + message);
	}});
}

$(function(){
	var albumId = getVar('albumId');
	loadAlbum(albumId);
});