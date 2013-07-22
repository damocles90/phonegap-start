/*
 *
 * Copyright (c) 2008-2010, Felix Bruns <felixbruns@web.de>
 *
 */

var X2JS = new X2JS();

function SevenDigital(options){
	/* Set default values for required options. */
	var apiKey    = options.apiKey    || '';
	var apiSecret = options.apiSecret || '';
	var apiUrl    = options.apiUrl    || 'http://api.7digital.com/1.2/';
	var cache     = options.cache     || undefined;

	/* Set API key. */
	this.setApiKey = function(_apiKey){
		apiKey = _apiKey;
	};

	/* Set API key. */
	this.setApiSecret = function(_apiSecret){
		apiSecret = _apiSecret;
	};

	/* Set API URL. */
	this.setApiUrl = function(_apiUrl){
		apiUrl = _apiUrl;
	};

	/* Set cache. */
	this.setCache = function(_cache){
		cache = _cache;
	};

	var getResponse = function(data)
	{
		var xml = data.getElementsByTagName("response")[0].childNodes.item(0);
		var json = X2JS.xml2json(xml);
		
		return json;
		
	}
	
	/* Internal call (POST, GET). */
	var internalCall = function(method, params, callbacks, requestMethod){
		/* Cross-domain POST request (doesn't return any data, always successful). */
		if(requestMethod == 'POST'){
			undefined
		}
		/* Cross-domain GET request (JSONP). */
		else{
			/* Build parameter string. */
			var array = [];

			for(var param in params){
				array.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
			}

			/* Set script source. */

			var reqLocation = apiUrl + method + '?' + array.join('&').replace(/%20/g, '+');
			var ajaxObj = {
				type: "GET",
				url: reqLocation,
			};
			
			alert(reqLocation);
			
			ajaxObj.success = callbacks.success ? function(data){alert(data);callbacks.success	(getResponse(data));} : undefined;
			ajaxObj.error = callbacks.error;
			//console.log(reqLocation);
			$.ajax(ajaxObj);
		}
	};

	/* Normal method call. */
	var call = function(method, params, callbacks, requestMethod){
		/* Set default values. */
		params        = params        || {};
		callbacks     = callbacks     || {};
		requestMethod = requestMethod || 'GET';

		/* Add parameters. */
		params.oauth_consumer_key = apiKey;

		/* Call method. */
		internalCall(method, params, callbacks, requestMethod);
	};

	/* Signed method call. */
	var signedCall = function(method, params, session, callbacks, requestMethod){
		/* Set default values. */
		params        = params        || {};
		callbacks     = callbacks     || {};
		requestMethod = requestMethod || 'GET';

		/* Add parameters. */
		params.oauth_consumer_key = apiKey;

		/* Call method. */
		internalCall(method, params, callbacks, requestMethod);
	};

	/* release methods. */
	this.release = {
		details : function(params, callbacks){
			call('release/details', params, callbacks);
		},
	
		tracks : function(params, callbacks){
			call('release/tracks', params, callbacks);
		},
	};

	/* Artist methods. */
	this.artist = {

		search : function(params, callbacks){
			call('artist/search', params, callbacks);
		},
		
		details : function(params, callbacks){
			call('artist/details', params, callbacks);
		},
		
		similar : function(params, callbacks){
			call('artist/similar', params, callbacks);
		},
		
		releases : function(params, callbacks){
			call('artist/releases', params, callbacks);
		}
	};

	/* Auth methods. */
	this.auth = {
		getMobileSession : function(params, callbacks){
			/* Set new params object with authToken. */
			params = {
				username  : params.username,
				authToken : md5(params.username + md5(params.password))
			};

			signedCall('auth.getMobileSession', params, null, callbacks);
		},

		getSession : function(params, callbacks){
			signedCall('auth.getSession', params, null, callbacks);
		},

		getToken : function(callbacks){
			signedCall('auth.getToken', null, null, callbacks);
		},

		/* Deprecated. Security hole was fixed. */
		getWebSession : function(callbacks){
			/* Save API URL and set new one (needs to be done due to a cookie!). */
			var previuousApiUrl = apiUrl;

			apiUrl = 'http://ext.last.fm/2.0/';

			signedCall('auth.getWebSession', null, null, callbacks);

			/* Restore API URL. */
			apiUrl = previuousApiUrl;
		}
	};
	
	/* Track methods. */
	this.track = {
		preview : function(params, callbacks){
			call('track/preview', params, callbacks);
		}
	};

	/* Private auth methods. */
	var auth = {
		getApiSignature : function(params){
			var keys   = [];
			var string = '';

			for(var key in params){
				keys.push(key);
			}

			keys.sort();

			for(var index in keys){
				var key = keys[index];

				string += key + params[key];
			}

			string += apiSecret;

			/* Needs lastfm.api.md5.js. */
			return md5(string);
		}
	};
}
