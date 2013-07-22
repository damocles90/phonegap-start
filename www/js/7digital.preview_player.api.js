"use strict"
var sevenDigital = new SevenDigital({
	apiKey : '7dhtmjkgv2qz',
	apiSecret : 'wz2j3zp2uugu5xvz'
});

var SevenDigitalPreviewPlayer = function() {
  // helpers
  var callbackCount = 0;
  var apiCall = function(args, callback) {
	var track = args.track;
    sevenDigital.track.preview({trackId: track._id, redirect: false}, {success : callback, error : function(code, message){
    	alert(code + ": " + message);
    }});
  }

  // private methods
  var apiCallback = function(data) {
    try {
      if(data) {
        setError.call(this, false);
        this._previewUrl = data;
        this._audioPlayerE.src = this._previewUrl;
      }
      else
        setError.call(this, true);
    }
    catch (e) {
      setError.call(this, true);
    }
    setLoaded.call(this, true);
    drawInCanvas.call(this);
  }

  var playAction = function() {
    if(!this.isLoaded() || this.isError())
      return;
    if(this.isPlaying())
      this.pause();
    else
      this.play();
  }

  var audioPlayerTimeUpdate = function(e) {
    setProgression.call(this, this._audioPlayerE.currentTime / this._audioPlayerE.duration);
    if(this.progression() == 1) {
      setProgression.call(this, 0);
      this.pause();
    }
    else
      drawInCanvas.call(this);
  }

  var drawInCanvas = function() {
    var ctx = this._canvasCtx;
    var radius = this._DOMElement.offsetWidth / 2;
    this._canvasButton.width = radius * 2;
    this._canvasButton.height = radius * 2;
    var progressionWidth = 3;

    ctx.clearRect(0, 0, radius * 2, radius * 2);

    if(this.progression() > 0) {
      var angle = this.progression() * 2 * Math.PI - Math.PI / 2;

      ctx.beginPath();
      ctx.arc(radius, radius, radius, - Math.PI / 2, angle, false);
      ctx.arc(radius, radius, radius - progressionWidth, angle, - Math.PI / 2, true);
      ctx.closePath();
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fill();
    }
  }

  // private accessors
  var setLoaded = function(loaded) {
    if(loaded == this._loaded)
      return;
    this._loaded = loaded;
    if(loaded) {
      this.DOMElement().classList.add('loaded');
      this.onLoaded();
    }
    else
      this.DOMElement().classList.remove('loaded');
  }  
  var setError = function(error) {
    if(error == this._error)
      return;
    this._error = error;
    if(error)
      this.DOMElement().classList.add('error');
    else
      this.DOMElement().classList.remove('error');
  }  
  var setPlaying = function(playing) {
    if(playing == this._playing)
      return;
    this._playing = playing;
    if(playing)
      this.DOMElement().classList.add('playing');
    else
      this.DOMElement().classList.remove('playing');
  }
  var setProgression = function(progression) {
    this._progression = progression;
  }

  // constructor
  var player = function(track) {
    this._DOMElement = document.createElement('a');
    this._DOMElement.classList.add('iTunesPreviewPlayer');
    this._DOMElement.addEventListener('click', playAction.bind(this));

    this._canvasButton = document.createElement('canvas');
    this._canvasCtx = this._canvasButton.getContext('2d');

    this._audioPlayerE = document.createElement('audio');
    this._audioPlayerE.preload = 'none';
    this._audioPlayerE.addEventListener('timeupdate', audioPlayerTimeUpdate.bind(this));

    this._DOMElement.appendChild(this._canvasButton);
    this._DOMElement.appendChild(this._audioPlayerE);

    setLoaded.call(this, false);
    setError.call(this, false);
    setPlaying.call(this, false);
    setProgression.call(this, 0);

    this._artistName = track.artist.name;
    this._trackName = track.title;
    
    drawInCanvas.call(this);
    Object
    apiCall({ 
      track: track,
      limit: 1, 
      entity: 'musicTrack' 
    }, apiCallback.bind(this));
  }
  player.prototype = {
    // delegate callbacks
    onLoaded: function() {},

    // public accessors
    DOMElement: function() {
      return this._DOMElement;
    },
    isLoaded: function() {
      return this._loaded;
    },
    isError: function() {
      return this._error;
    },
    isPlaying: function() {
      return this._playing;
    },
    progression: function() {
      return this._progression;
    },
    artistName: function() {
      return this._artistName;
    },
    trackName: function() {
      return this._trackName;
    },

    // public methods
    play: function() {
      if(this.isPlaying())
        return;
      setPlaying.call(this, true);
      this._audioPlayerE.play();
      drawInCanvas.call(this);
    },
    pause: function() {
      if(!this.isPlaying())
        return;
      setPlaying.call(this, false);
      this._audioPlayerE.pause();
      drawInCanvas.call(this);
    }
  };
  return player;
}();