largeSync = (function(){
  //check dependencys
  if(typeof chrome.storage === 'undefined' || typeof chrome.storage.sync === 'undefined' ){
    throw Error('[largeSync] - chrome.storage.sync is undefined, check that the "storage" permission included in your manifest.json');
  }
  var chromeSync = chrome.storage.sync;

  var keyPrefix = "LS",
    maxBytes = chromeSync.QUOTA_BYTES,
    maxBytesPerKey = chromeSync.QUOTA_BYTES_PER_ITEM,
    version = "{{ VERSION }}",
    onChangedEnabled = true, // prevent the largeSyncOnChangedCallback execution.
    operationStatus = { 
      isBusy : false, 
      done : function(){
        this.isBusy = false;
      }
    };

  /**For each object key in @param obj, JSON stringify then LZString base64 then split into
   * parts of @param maxLength, add a metadata object describing how to reverse the process.
   * 
   * @param  {Object} obj, the object to split
   * @param  {number} maxLength(optional), the length in bytes of each part
   * @return {Object} object containing all chunks and metadata ready for storage.
   */
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
          largeSyncversion : version};
      }
    }
    return ret;
  }
  /**For each metadata object in @param splitObjects, attempt to reconstruct the object from its parts
   * 
   * @param  {Object} splitObjects, the return value of split(obj, maxLength)
   * @param  {Array} keys(optional), the keys of objects you want to reconstruct
   * @return {Object} the reconstructed objects
   */
  function reconstruct(splitObjects, keys){
    if(typeof keys === 'undefined'){ 
      keys = extractKeys(splitObjects);
    }
    var ret = {};
    for(var i = 0; i < keys.length; i++){ var key = keys[i];
      var rejoined = "",
      meta = splitObjects[getStorageKey(key, "meta")];

      if(meta  !== 'undefined'){
        for (var j = 0; j < meta.max; j++) {
          if(typeof splitObjects[getStorageKey(key, j)] === 'undefined'){
            throw Error("[largeSync] - partial string missing, object cannot be reconstructed.");
          }
          rejoined += splitObjects[getStorageKey(key, j)];
        }
        ret[key] = JSON.parse(LZString.decompressFromBase64(rejoined));
      }
    }
    return ret;
  }
  
  function getStorageKey(key, postfix){
    return keyPrefix + "__" + key + "." + postfix;
  }

  // There is a maximum of maxBytes/maxBytesPerKey keys of storage available.
  // therefore when using largeSync.get(objKeys) we requsest all posible parts keys for each obj key
  function getRequestKeys(keys, num){
    if(typeof num === "undefined"){
      num = maxBytes/maxBytesPerKey;
    }
    var re = [];
    for(var i =0; i < getKeys(keys).length; i++){ var key = keys[i];

      for(var j = 0; j < num ; j++){
        re.push(getStorageKey(key, j));
      }
      re.push(getStorageKey(key, "meta"));
    }
    return re;
  }
  //this factors in the length of the key towards how much storage can be used.
  function calculateMaxLength(key, maxLength){ 
    return maxLength - (keyPrefix.length + key.length + 10);
  }
  //given string or array of string or object keys,
  //returns array of keys.
  function getKeys(keys){
    if(typeof keys !== 'undefined' && keys !== null){
      if(keys.constructor.name === 'Object'){
        return Object.keys(keys);
      }else if (keys.constructor.name === 'Array' || typeof keys === 'string'){
        return Array.from(keys);
      }
    }throw TypeError('[largeSync] - ' + keys + ' must be of type "Object", "Array" or "string"');
  }
  //For any meta data objects int the splitObjects get its object key
  function extractKeys(splitObjects){
    var ret =  Object.keys(splitObjects)
      .map(function(x){
        var match = x.match(keyPrefix+"\_\_(.*?)\.meta");
        if(match !== null){
          return match[1];
        }
      });
    return ret.filter(Boolean);
  }   
  function matchesPrefix(key){
    var re = new RegExp('^'+keyPrefix);
    var match = key.match(re);
    if(match !== null) return true;
    return false;
  }
  function basicHash(str){
    var hash = 0;
      if (str.length === 0) return hash;
      for (var i = 0; i < str.length; i++) {
          var chr = str.charCodeAt(i);
          hash = ((hash<<5)-hash)+chr;
          hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
  }
  /**Gets one or more items from storage.
   * @param  {string or array of string or object } keys
   * @param  {Function} callback
   */
  function get(keys, callback){ 
    var reqKeys = null;

    if(keys !== null){
      var objKeys = getKeys(keys);
      reqKeys = getRequestKeys(objKeys);
    }
    chromeSync.get(reqKeys, function(items){
      var x = reconstruct(items);
      callback(x);
    });
  }
  /**Sets multiple items.
   * @param {object} items
   * @param {Function} callback
   */
  function set(items, callback){
    if(items === null || typeof items === 'string' || items.constructor.name === 'Array'){
      // will throw error from "extensions::schemaUtils"
      chromeSync.set(items, callback);
    }else{
      var splitItems = split(items, maxBytesPerKey);
      
      var splitKeys = getKeys(splitItems);
      var reqKeys = getRequestKeys(getKeys(items));
      var removeKeys = reqKeys.filter(function(x) {return splitKeys.indexOf(x) < 0;});
      
      // //remove partials keys that are no longer in use
      // chromeSync.remove(removeKeys, function(){
      //   onChangedEnabled = true;

      //   //set the values;
      //   chromeSync.set(splitItems, callback);
      // }); 
      // if(!operationStatus.isBusy){
        operationStatus.isBusy = true;
        chromeSync.set(splitItems, function(){
          onChangedEnabled = false;
          // callback();
          chromeSync.remove(removeKeys, function(){
            onChangedEnabled = true;
            operationStatus.done();
            callback();
          });
        });
      // }else{
      //   throw Error("isBusy on previous request");
      // }
    }

  }
  /**Removes one or more items from storage.
   * @param  {string or array of string } keys
   * @param  {Function} callback
   */
  function remove(keys, callback){
    if(keys === null){
      // will throw error from "extensions::schemaUtils"
      chromeSync.remove(null, callback);
    }else{
      var removeKeys = getRequestKeys(getKeys(keys));
      chromeSync.remove(removeKeys, callback);
    }
  }
  /** Gets the amount of space (in bytes) being used by one or more items.
   * @param  {(string or array of string} keys
   * @param  {Function} callback
   */
  function getBytesInUse(keys, callback){
    if(keys === null){
      chromeSync.getBytesInUse(null, callback);
    }else{
      var objectKeys = getRequestKeys(getKeys(keys));
      chromeSync.getBytesInUse(objectKeys, callback);
    }
  }
  /**Removes all items from storage. (warn: will also delete items not belonging to largeSync)
   * @param  {Function}
   * @return {[type]}
   */
  function clear(callback){
    chromeSync.clear(callback);
  }

  function getkeyPrefix(){return keyPrefix;}
  function setkeyPrefix(val){keyPrefix = val;}


  /**Usage: chrome.storage.onChanged.addListener(largeSyncOnChangedCallback(function(changes, area){}))
   * @param  {Function}
   * @return {[type]}
   */
  function largeSyncOnChangedCallback(callback){

    function getMetaDatas(changes){
      var keys = extractKeys(changes);

      for(var i =0; i < keys.length; i++){ key = keys[i];
        var metaPartKey = getStorageKey(key, 'meta');
        if(typeof changes[metaPartKey].newValue !== 'undefined'){

          var metaNew = changes[metaPartKey].newValue;
          for (var i = 0; i < metaNew.max; i++) {
            
          };
        }
      }
    }
    function getOldValues(changes){ 
      var uniqKeys = getKeys(changes).map(function(x) 
        {
          var match = x.match(/LS\_\_(.*?)\.\d+/);
          if (match !== null ) {
            return match[1];
        }
      })
      .filter(function(value, index, self) 
        {
          return self.indexOf(value) === index;
        })
      .filter(Boolean)      
      console.log(uniqKeys);
      var metaKeys = extractKeys(changes);
      console.log(metaKeys);


    }
    function getNewValues(key, changes){

    }
    function separateOldAndNewValues(changes){
      var oldValues = {};
      var newValues = {};
      for (var key in changes){
        
        if(matchesPrefix(key)){
          var current = changes[key];
          if(typeof current.oldValue !== 'undefined'){
            oldValues[key] = current.oldValue;
          }
          if(typeof current.newValue !== 'undefined'){
            newValues[key] = current.newValue;
          }
        }
        
      }
      return {oldValues: oldValues,  newValues: newValues};
    }

    function getOldValue(oldPartials){
      var oldValue = {};
      try{
        oldValue = reconstruct(oldPartials);
      }catch(err){
        console.log(err);
      }
      return oldValue;
    }

    var ret = function(changes, areaName){
      console.log("listenerCalled");
      if(onChangedEnabled === true && areaName === 'sync'){
        var largeSyncChanges = {};

        var keys = extractKeys(changes);
        var allKeys = getRequestKeys(keys);
        // var diff keys.filter(function(x){return })

        // for(var i=0; i < keys.length; i++){ key = keys[i];
        //   //Check that all parts of the object is in changes
        //   var obj = {};
        //   var isAll = false;
        //   for(var j = 0; j < getStorageKey(key, "meta").max; j++){
        //     var partKey = getStorageKey(key, i)
        //     if(typeof changes[partKey] !== 'undefined' ){
        //       // obj[partKey] = change
        //     }
        //   }
        // }
        // getOldValues(changes)
        // console.log(keys);
        // console.log(changes, areaName);

        var x = separateOldAndNewValues(changes);
        var y = getOldValue(x.oldValues);
        var z = getOldValue(x.newValues);
        console.log("changes", changes);
        console.log("partials", x);
        console.log("oldValues", y);
        console.log("newValues", z);

        callback({"old" : y, "new" : z}, areaName);
      }
      
    };
    return ret;
  }

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
      utils : {
        basicHash : basicHash,
        getKeys : getKeys,
        extractKeys : extractKeys,
        getStorageKey : getStorageKey,
        getRequestKeys : getRequestKeys,
        matchesPrefix : matchesPrefix,
        getBusyStatus : function(){return operationStatus;}
      }
    },
    _config : {
      getkeyPrefix : getkeyPrefix,
      setkeyPrefix : setkeyPrefix
    },

    onChangedCallback : largeSyncOnChangedCallback

  };

  // window.chrome.storage.onChanged.addListenerlargeSync = function(callback){};
  window.chrome.storage.largeSync = api;

  return api;
}());