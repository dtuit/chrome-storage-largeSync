largeSync - chrome-storage-largeSync
===============================
largeSync wraps  [`chrome.storage.sync`](https://developer.chrome.com/extensions/storage). it makes it easy to store objects larger than is allowed by default. Useful for Google Chrome extensions and apps.

chrome.storage.sync enforces two byte limits.

  * `QUOTA_BYTES_PER_ITEM` 8,192 - (measured by the JSON stringification of the item plus its key length)
  * `QUOTA_BYTES` 102,400 - (total across all items)
  
largeSync "compresses" and splits objects up between multiple keys in chrome.storage.sync, this makes `QUOTA_BYTES` the only relevant space limitation.

####Dependencies
[`lz-string`](https://github.com/pieroxy/lz-string/) - "compress" strings

###Install
----------
The file to use is `dist/chrome-storage-largeSync.min.js` or `dist/chrome-storage-largeSync.js` 

####bower : 
`TODO bower install chrome-storage-largeSync --save`

####npm:
`TODO`

for local build run these commands
`npm install`
`bower install`
`grunt install`

###Usage
largeSync exposes the same api schema as [`chrome.storage`](https://developer.chrome.com/apps/storage#type-StorageArea),
The API is exposed in two different places `largeSync` and `chrome.storage.largeSync`

####Methods

```
//get: Gets one or more items from storage.
largeSync.get(string or array of string or object keys, function callback);

//getBytesInUse: Gets the amount of space (in bytes) being used by one or more items.
largeSync.getBytesInUse(string or array of string keys, function callback);

//set : Sets multiple items.
largeSync.set(object items, function callback);

//remove: Removes one or more items from storage.
largeSync.remove(string or array of string keys, function callback);

//clear: Removes all items from storage.
largeSync.clear(function callback);
```

####Example
```javascript
var testObj = {'a' : [], 'b' : []};
for (var i = 0; i < 5000; i++) {
	testObj.a.push({text : 'sometext_a_'+i});
	testObj.b.push({text : 'sometext_b_'+i});
}
chrome.storage.largeSync.set(testObj);
```
chrome.storage.sync will now contain something similar to this.
![resulting objects in storage](http://i.imgur.com/xq88M1D.png)

to retrieve and reconstruct the object
```javascript
chrome.storage.largeSync.get(["a", "b"], function(items){
	console.log(items)
	// "items" is equal to "testObj"
});
```

###Tests
load `test` folder as an unpacked extension. it will override the new-tab page.

----------