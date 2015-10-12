var sizeLimit = 8192
var testObj = { a : []};
var keyPrefix = "SM";

for (var i = 0; i < 1000; i++) {
	testObj.a.push({text : makeid(10)});
};

function makeid(n)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function splitObj(key, obj, len){
	var str = JSON.stringify(obj),
		ret = {},
		storeKey = getBaseStoreKey(key),
		i = 0;

	for (var offset = 0, strLen = str.length; offset < strLen; offset += len, i++) {
		ret[ storeKey+i ] = str.substring(offset, offset + len);
	}
	ret[storeKey + "meta"] = {key: key, min: 0, max: i, hash : hash(str)};
	return ret;
}

function repairObj(key, strObjs){
	var re = "",
		storeKey = getBaseStoreKey(key),
		meta = strObjs[storeKey + "meta"];

	for (var i = 0; i < meta.max; i++) {
		if(typeof strObjs[storeKey+ i] === 'undefined'){
			throw Error("partial string missing, object cannot be reconstructed.");
		}
		re += strObjs[storeKey + i];
	}
	return JSON.parse(re);
}

function genGetRequestKeys(key){
	var re = [],
		storeKey = getBaseStoreKey(key);
	
	for(var i = 0; i < 512; i++){
		re.push(storeKey+i);
	}
	re.push(storeKey+"meta");
	return re;
}


function getBaseStoreKey(key){
	return keyPrefix + "_" + key + "_";
}

function hash(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+chr;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function getSizeLimit(key, STORE_MAX){
	var keyLen = keyPrefix.length + key.length + 5;
	return STORE_MAX - keyLen;
}


var x = splitObj("testObj",testObj, sizeLimit);

var y = repairObj("testObj", x);

console.log(y);