var utils = {
		splitObj : function(keys, obj, maxLen){
			var ret = {};
			for(var key in keys){
				var str = JSON.stringify(obj),
				storeKey = this.getBaseStoreKey(key),
				i = 0;

				for (var offset = 0, strLen = str.length; offset < strLen; offset += len, i++) {
					ret[ storeKey+i ] = str.substring(offset, offset + len);
				}
				ret[storeKey + "meta"] = {key: key, min: 0, max: i, hash : this.basicHash(str)};
			}
			return ret;		
		},
		reconstructObj : function(keys, strObjs){
			var ret = {};
			for(var key in keys){
				var re = "",
				storeKey = this.getBaseStoreKey(key),
				meta = strObjs[storeKey + "meta"];

				if(meta  !== 'undefined'){
					for (var i = 0; i < meta.max; i++) {
						if(typeof strObjs[storeKey+ i] === 'undefined'){
							throw Error("partial string missing, object cannot be reconstructed.");
						}
						re += strObjs[storeKey + i];
					}
					ret[key] = JSON.parse(re);
				}
			}
			return ret;
		},
		genReqKeys : function(key){
			var re = [],
				storeKey = this.getBaseStoreKey(key);
			
			for(var i = 0; i < 12; i++){
				re.push(storeKey+i);
			}
			re.push(storeKey+"meta");
			return re;
		},
		getBaseStoreKey : function(key){
			return keyPrefix + "_" + key + "_";
		},
		basicHash : function(obj){
		    var hash = 0;
		    if (str.length == 0) return hash;
		    for (i = 0; i < str.length; i++) {
		        chr = str.charCodeAt(i);
		        hash = ((hash<<5)-hash)+chr;
		        hash = hash & hash; // Convert to 32bit integer
		    }
		    return hash;
		},
		calcMaxLenght : function(key){
			var keyLen = keyPrefix.length + key.length + 5;
			return STORE_MAX - keyLen;
		},
		getKeys : function(keys){
			if(typeof keys !== 'undefined'){
				if(keys.constructor.name === 'Object'){
					return Object.keys(keys);
				}else if (keys.constructor.name === 'Array' || typeof keys === 'string'){
					return Array.from(keys);
				}
			}throw TypeError('[syncMore] - ' + keys + ' must be of type "Object", "Array" or "string"');
		},
	};