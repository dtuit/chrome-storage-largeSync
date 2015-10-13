syncMore = (function(){
	if(typeof chrome.storage === 'undefined' || typeof chrome.storage.sync === 'undefined' ){
		throw Error('[syncMore] - chrome.storage.sync is undefined, check that the "storage" permission included in your manifest.json');
	}
	var chromeSync = chrome.storage.sync;

	var keyPrefix = "SM",
		maxBytes = chromeSync.QUOTA_BYTES,
		maxBytesPerKey = chromeSync.QUOTA_BYTES_PER_ITEM,
		version = "0.0.1";

	function split(obj, maxLength){
		if(typeof maxLength === 'undefined'){
			maxLength = maxBytesPerKey;
		}
		var keys = getKeys(obj);
		var ret = {};

		for(var i = 0; i < keys.length; i++){ var key = keys[i];
			if(obj.hasOwnProperty(key)){
				
				var str = LZString.compressToBase64(JSON.stringify(obj[key]));
				var max = calculateMaxLength(key, maxLength);
				var j = 0;

				for (var offset = 0, strLen = str.length; offset < strLen; offset += max, j++) {
					ret[ getStorageKey(key, j) ] = str.substring(offset, offset + max);
				} 
				ret[ getStorageKey(key, "meta") ] = {
					key: key, min: 0, max: j,
					hash : basicHash(str),
					syncMoreversion : version};
			}
		}
		return ret;
	}

	function reconstruct(splitObjects, keys){
		if(typeof keys == 'undefined'){ 
			keys = extractKeys(splitObjects);
		}
		var ret = {};
		for(var i = 0; i < keys.length; i++){ var key = keys[i];
			var rejoined = "",
			meta = splitObjects[getStorageKey(key, "meta")];

			if(meta  !== 'undefined'){
				for (var j = 0; j < meta.max; j++) {
					if(typeof splitObjects[storeKey+ j] === 'undefined'){
						throw Error("[syncMore] - partial string missing, object cannot be reconstructed.");
					}
					rejoined += splitObjects[storeKey + j];
				}
				ret[key] = JSON.parse(LZString.decompressFromBase64(rejoined));
			}
		}
		return ret;
	}
	
	function getStorageKey(key, postfix){
		return keyPrefix + "__" + key + "." + postfix;
	}
	function getRequestKeys(key){
		var re = [];
		for(var i = 0; i < maxBytes/maxBytesPerKey ; i++){
			re.push(getStorageKey(key, i));
		}
		re.push(getStorageKey(key, "meta"));
		return re;
	}
	function calculateMaxLength(key, maxLength){ 
		return maxLength - (keyPrefix.length + key.length + 10);
	}
	function getKeys(keys){
		if(typeof keys !== 'undefined'){
			if(keys.constructor.name === 'Object'){
				return Object.keys(keys);
			}else if (keys.constructor.name === 'Array' || typeof keys === 'string'){
				return Array.from(keys);
			}
		}throw TypeError('[syncMore] - ' + keys + ' must be of type "Object", "Array" or "string"');
	}
	function extractKeys(splitObjects){
		var ret =  Object.keys(splitObjects)
			.filter(function(x){
				return x.indexOf("meta") > -1;
			})
			.map(function(x){
				var match = x.match("\_\_(.*?)\.");
				if(match != null){
					return match[1];
				}
				return "";
			});
		return ret.filter(Boolean);
	}	
	function basicHash(str){
		var hash = 0;
	    if (str.length === 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        chr = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+chr;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	function get(){
		var objKeys = utils.getKeys(keys);
		console.log(objKeys);
		var reqKeys = objKeys.map(function(x){return utils.genReqKeys(x);}).reduce(function(x,y){return x.concat(y);});
		console.log(reqKeys);

		chromeSync.get(reqKeys, function(items){
			console.log(items);
			var x = utils.reconstructFromChunks(items);
			callback(x);
		});
	}
	function set(){
		var splitItems = utils.splitIntoChunks(items, ns.QUOTA_BYTES_PER_ITEM);
		console.log(splitItems);
		chromeSync.set(splitItems, callback);
	}
	function remove(){}
	function getBytesInUse(){}
	function clear(){
		chromeSync.clear(callback);
	}

	function getkeyPrefix(){return keyPrefix;}
	function setkeyPrefix(val){keyPrefix = val;}

	var api = {

		QUOTA_BYTES : maxBytes,
		QUOTA_BYTES_PER_ITEM : maxBytes,
		QUOTA_BYTES_PER_KEY : maxBytesPerKey,

		MAX_ITEMS : chromeSync.MAX_ITEMS,
		MAX_WRITE_OPERATIONS_PER_HOUR : chromeSync.MAX_WRITE_OPERATIONS_PER_HOUR,
		MAX_WRITE_OPERATIONS_PER_MINUTE : chromeSync.MAX_WRITE_OPERATIONS_PER_MINUTE,
		
		VERSION : version,

		get : get,
		set : set,
		remove : remove,
		getBytesInUse : getBytesInUse,
		clear : clear,
		_core : {
			split : split,
			reconstruct : reconstruct,
			getkeyPrefix : getkeyPrefix,
			setkeyPrefix : setkeyPrefix
		}
	};

	window.chrome.storage.onChanged.addListenerSyncMore = function(callback){};
	window.chrome.storage.syncMore2 = api;

	return api;
}());