// var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);


// var syncMore = window.syncMore || {};
// 	syncMore.keyPrefix = syncMore.keyPrefix || "SM";
// 	syncMore.VERSION = "0.0.1";

// (function(){
// 	(typeof syncMore === 'undefined') ? syncMore = {} : syncMore = syncMore;
// 	(typeof syncMore.keyPrefix === 'undefined') ? syncMore.keyPrefix = "SM" : syncMore.keyPrefix = syncMore.keyPrefix;
// 	syncMore.VERSION = "0.0.1";
// }());

syncMore2 = (function(){
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

// (function(ns){
// 	ns.utils = {
// 		splitIntoChunks: function(obj, maxLen){
// 			if(typeof maxLen === 'undefined'){
// 				throw TypeError("[syncMore] - maxLen is undefined");
// 			}
// 			var keys = this.getKeys(obj);
// 			var ret = {};

// 			for(var i = 0; i < keys.length; i++){ var key = keys[i];
// 				if(obj.hasOwnProperty(key)){
					
// 					var str = JSON.stringify(obj[key]);
// 					str = LZString.compressToBase64(str);
// 					var storeKey = this.getBaseStoreKey(key);
// 					var max = this.calcMaxLength(key, maxLen);
// 					var j = 0;

// 					for (var offset = 0, strLen = str.length; offset < strLen; offset += max, j++) {
// 						console.log(str.substring(offset, offset + max).length)
// 						ret[ storeKey+j ] = str.substring(offset, offset + max);
// 					} 
// 					ret[storeKey + "meta"] = {
// 						key: key,
// 						min: 0, 
// 						max: j,
// 						hash : this.basicHash(str),
// 						syncMoreversion : ns.VERSION};
// 				}
// 			}

// 			return ret;
// 		},
// 		reconstructFromChunks : function(strObjs, keys){
// 			if(typeof keys == 'undefined'){ 
// 				keys = this.extractKeys(strObjs);
// 			}
// 			var ret = {};
// 			for(var i = 0; i < keys.length; i++){ var key = keys[i]
// 				console.log(key);
// 				var re = "",
// 				storeKey = this.getBaseStoreKey(key),
// 				meta = strObjs[storeKey + "meta"];

// 				if(meta  !== 'undefined'){
// 					for (var j = 0; j < meta.max; j++) {
// 						if(typeof strObjs[storeKey+ j] === 'undefined'){
// 							throw Error("[syncMore] - partial string missing, object cannot be reconstructed.");
// 						}
// 						re += strObjs[storeKey + j];
// 					}
// 					ret[key] = JSON.parse(LZString.decompressFromBase64(re));
// 				}
// 			}
// 			return ret;
// 		},
// 		//Extract keys from the splitObjects only considers objects where the metadata object is present
// 		extractKeys : function(strObjs){
// 			var ret =  Object.keys(strObjs)
// 				.filter(function(x){
// 					return x.indexOf("meta") > -1;
// 				})
// 				.map(function(x){
// 					var match = x.match("\_\_(.*?)\.");
// 					if(match != null){
// 						return match[1];
// 					}
// 					return "";
// 				});
// 			return ret.filter(Boolean);
// 		},
// 		genReqKeys : function(key){
// 			var re = [],
// 				storeKey = this.getBaseStoreKey(key);
			
// 			for(var i = 0; i < 12; i++){
// 				re.push(storeKey+i);
// 			}
// 			re.push(storeKey+"meta");
// 			return re;
// 		},
// 		getBaseStoreKey : function(key, postfix){
// 			// return ns.keyPrefix + "__" + key + "__";
// 			return ns.keyPrefix + "__" + key + "." + postfix;
// 		},
// 		basicHash : function(str){
// 		    var hash = 0;
// 		    if (str.length === 0) return hash;
// 		    for (i = 0; i < str.length; i++) {
// 		        chr = str.charCodeAt(i);
// 		        hash = ((hash<<5)-hash)+chr;
// 		        hash = hash & hash; // Convert to 32bit integer
// 		    }
// 		    return hash;
// 		},
// 		calcMaxLength : function(key, maxLen){
// 			var keyLen = keyPrefix.length + key.length +10;
// 			return maxLen - keyLen;
// 		},
// 		getKeys : function(keys){
// 			if(typeof keys !== 'undefined'){
// 				if(keys.constructor.name === 'Object'){
// 					return Object.keys(keys);
// 				}else if (keys.constructor.name === 'Array' || typeof keys === 'string'){
// 					return Array.from(keys);
// 				}
// 			}throw TypeError('[syncMore] - ' + keys + ' must be of type "Object", "Array" or "string"');
// 		},
// 	};

// 	if(typeof chrome.storage === 'undefined' || typeof chrome.storage.sync === 'undefined' ){
// 		throw Error('[syncMore] - chrome.storage.sync is undefined, check that the "storage" permission included in your manifest.json');
// 	}
// 	var chromeSync = chrome.storage.sync;
// 	var utils = ns.utils;

// 	ns.QUOTA_BYTES = chromeSync.QUOTA_BYTES;
// 	ns.QUOTA_BYTES_PER_ITEM =chromeSync.QUOTA_BYTES_PER_ITEM;
// 	ns.MAX_ITEMS = chromeSync.MAX_ITEMS;
// 	ns.MAX_WRITE_OPERATIONS_PER_HOUR = chromeSync.MAX_WRITE_OPERATIONS_PER_HOUR;
// 	ns.MAX_WRITE_OPERATIONS_PER_MINUTE = chromeSync.MAX_WRITE_OPERATIONS_PER_MINUTE;

// 	ns.get = function(keys, callback){
// 		var objKeys = utils.getKeys(keys);
// 		console.log(objKeys);
// 		var reqKeys = objKeys.map(function(x){return utils.genReqKeys(x);}).reduce(function(x,y){return x.concat(y);});
// 		console.log(reqKeys);

// 		chromeSync.get(reqKeys, function(items){
// 			console.log(items);
// 			var x = utils.reconstructFromChunks(items);
// 			callback(x);
// 		});
// 	};
// 	ns.set = function(items, callback){
// 		var splitItems = utils.splitIntoChunks(items, ns.QUOTA_BYTES_PER_ITEM);
// 		console.log(splitItems);
// 		chromeSync.set(splitItems, callback);
// 	};
// 	ns.getBytesInUse = function(keys, callback){

// 	};
// 	ns.remove = function(keys, callback){

// 	};
// 	ns.clear = function(callback){
// 		chromeSync.clear(callback);
// 	};
// 	//create custom add listener
// 	window.chrome.storage.onChanged.addListenerSyncMore = function(callback){};
// 	//attach to chrome.storage namespace.
// 	window.chrome.storage.syncMore = {
// 		get : ns.get,
// 		set : ns.set,

// 	};
// }(syncMore));