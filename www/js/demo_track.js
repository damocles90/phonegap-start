function playAudio()
{
	try {
	    var myaudio = new Audio('http://icecast.ksl.com:8000/');
	    myaudio.id = 'playerMyAdio';
	    myaudio.play();
	  } catch (e) {
	    alert('no audio support!');
	  }
}