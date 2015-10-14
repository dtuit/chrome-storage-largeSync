/*
Test code for chrome-storage-largeSync.js
Is required to run inside of a chrome extension or app with the "storage" permission enabled.
*/

var testObj = {'a' : [], 'b' : []};
var maxLen = chrome.storage.largeSync.QUOTA_BYTES_PER_ITEM;

QUnit.module('largeSync.Core',{
	setup : function(){
		for (var i = 0; i < 1000; i++) {
			testObj.a.push({text : 'sometext_a_'+i});
			testObj.b.push({text : 'sometext_b_'+i});
		}
	},
	teardown: function(){
		testObj = {'a' : [], 'b' : []};
	}
});

QUnit.test( "check libary loaded", function( assert ) {
  assert.ok( largeSync !== undefined);
});


QUnit.test( "getKeys() works as intended", function( assert ){
	var x = ["a", "b"];
	var y = {a : "str", b : "str"};
	var z = "a";

	assert.deepEqual(largeSync._core.utils.getKeys(y), x);
	assert.deepEqual(largeSync._core.utils.getKeys(x), x);
	assert.deepEqual(largeSync._core.utils.getKeys(z), ["a"]);
	// largeSync._core.utils.getKeys(null);
});

QUnit.test("split - objects are split into chunks of correct length", function( assert ){

	var splitObj = largeSync._core.split(testObj, maxLen);
	var splitKeysWithoutMetaData = Object.keys(splitObj).filter(function(x){return x.indexOf("meta") <= -1;});

	//The length of each string is not greater than maxLength
	for (var i = 0; i <splitKeysWithoutMetaData.length; i++) { var key = splitKeysWithoutMetaData[i];
		assert.ok(splitObj[key].length <= maxLen);
	}
});

QUnit.test("split - objects are split into the correct number of chunks", function(assert){

	// make the testObject larger.
	for (var i = 0; i < 9000; i++) {
		testObj.a.push({text : 'sometext_a_'+i});
		testObj.b.push({text : 'sometext_b_'+i});
	}

	var splitObj = largeSync._core.split(testObj, maxLen);

	for(var i = 0, keys = Object.keys(testObj); i < keys.length; i++){ var key = keys[i];
		
		var jsonStr = LZString.compressToBase64(JSON.stringify(testObj[key])),
			expectedNumberOfObjects = Math.ceil(jsonStr.length/maxLen),
			actualNumerOfObjects = splitObj[largeSync._core.utils.getStorageKey(key ,"meta")].max;
		
		assert.ok(  expectedNumberOfObjects === actualNumerOfObjects , "expected number " + expectedNumberOfObjects + " actual "+ actualNumerOfObjects);
	}	
});

QUnit.test("basicHash() returns number" , function( assert){
	var str = 'A string with some stuff abcdefghijklmnopqrstuvwxyz0123456789(){}[]""-+=*&^%$#@!;:,';
	var x = largeSync._core.utils.basicHash(str);
	assert.equal(typeof x, 'number');
});

QUnit.test("objects are reconstructed correctly", function( assert){

	var splitObj = largeSync._core.split(testObj, maxLen);
	var reconstructed = largeSync._core.reconstruct(splitObj);

	var hashAfter = largeSync._core.utils.basicHash(
		LZString.compressToBase64(
			JSON.stringify(
				reconstructed.a
		)));
	
	assert.ok( splitObj["LS__a.meta"].hash == hashAfter, "the hash of the object is consistent before and after reconstrution");
	assert.deepEqual(testObj, reconstructed, "object is serilized, split, then reconstructed to return the orignal object");
});


QUnit.module('largeSync.IntegrationTests',{
	setup : function(){
		for (var i = 0; i < 1000; i++) {
			testObj.a.push({text : 'sometext_a_'+i});
			testObj.b.push({text : 'sometext_b_'+i});
		}
	},
	teardown: function(){
		chrome.storage.sync.clear();
		testObj = {'a' : [], 'b' : []};
	}
});

QUnit.test('Set', function( assert ){
	var done = assert.async();

	for (var i = 0; i < 9000; i++) {
		testObj.a.push({text : 'sometext_a_'+i});
		testObj.b.push({text : 'sometext_b_'+i});
	}

	largeSync.set(testObj, function(x){});

	var splitObj = largeSync._core.split(testObj);

	chrome.storage.sync.get(splitObj, function(items){
		assert.deepEqual(splitObj, items, "object in storage area is equal to its split object form");
		done();
	});
});
QUnit.test('Set - changes are persisted and chunks that are out of use are removed', function( assert ){
	var done = assert.async();

	for (var i = 0; i < 9000; i++) {
		testObj.a.push({text : 'sometext_a_'+i});
		testObj.b.push({text : 'sometext_b_'+i});
	}

	largeSync.set(testObj, function(){

		// Reduce the size of the testObject and rewrite it to storage.
		var testObj2 = {'a' : [], 'b' : []};
		var splitObj2 = largeSync._core.split(testObj2);
		
		largeSync.set(testObj2, function(){
			
			//get all items in storage
			chrome.storage.sync.get(null, function(items){

				assert.deepEqual(splitObj2, items, "only storage keys in use are persisted.");
				done();
			});

		});
	});
});
QUnit.test('Get - returns the object correctly', function( assert ){
	var done = assert.async();
	largeSync.set(testObj, function(){
		largeSync.get(["a"], function(items){
			// console.log(items, testObj.a);
			assert.deepEqual(items, {a : testObj.a}, "the object retrieved is the same as the one put in");
			done();
		});
	});


});

QUnit.test('Get - with key equal null returns the object correctly', function( assert ){
	var done = assert.async();
	largeSync.set(testObj, function(){
		largeSync.get(null, function(items){
			assert.deepEqual(items, testObj);
			done();
		});
	});
});
QUnit.test('Remove - all parts of the object are removed, and the remaining objects are left intact', function( assert ){
	var done = assert.async();
	largeSync.set(testObj, function(){
		largeSync.remove("a", function(){
			chrome.storage.sync.get(null, function(items){
				var reconstructed = largeSync._core.reconstruct(items);
				assert.deepEqual(reconstructed, {b : testObj.b});
				done();
			});
		});
	});
});

QUnit.test('Clear - clears the storage', function( assert){
	var done = assert.async();
	largeSync.set(testObj, function(){
		largeSync.clear(function(){
			chrome.storage.sync.get(null, function(items){
				assert.deepEqual(items, {}, "storage is completely clear");
				done();
			});
		});
	});
});