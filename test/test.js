var testObj = {'a' : [], 'b' : []};
var maxLen = 9000;

QUnit.module('SyncMore.Utils',{
	setup : function(){
		for (var i = 0; i < 1000; i++) {
			testObj.a.push({text : 'sometext_a_'+i});
			testObj.b.push({text : 'sometext_b_'+i});
		}
	},
	teardown: function(){
		for(var prop in testObj){
			if(prop !== 'a' && prop !== 'b'){
				delete testObj[prop];
			}
		}
	}
});

QUnit.test( "check libary loaded", function( assert ) {
  assert.ok( syncMore.utils !== undefined);
});

var utils = syncMore.utils;

QUnit.test( "get keys", function( assert ){
	var x = ["a", "b"];
	var y = {a : "str", b : "str"};
	var z = "a";

	assert.deepEqual(utils.getKeys(y), x);
	assert.deepEqual(utils.getKeys(x), x);
	assert.deepEqual(utils.getKeys(z), ["a"]);
});

QUnit.test("split objects int chunks of correct length", function( assert ){

	var splitObj = utils.splitIntoChunks(testObj, maxLen);
	var splitKeysWithoutMetaData = Object.keys(splitObj).filter(function(x){return x.indexOf("meta") <= -1;});

	//The length of each string is not greater than maxLength
	for (var i = 0; i <splitKeysWithoutMetaData.length; i++) { var key = splitKeysWithoutMetaData[i];
		assert.ok(splitObj[key].length <= maxLen);
	}
});

QUnit.test("split objects into the correct number of chunks", function(assert){

	var splitObj = utils.splitIntoChunks(testObj, maxLen);

	for(var i = 0, keys = Object.keys(testObj); i < keys.length; i++){ var key = keys[i];
		
		var jsonStr = JSON.stringify(testObj[key]),
			expectedNumberOfObjects = Math.ceil(jsonStr.length/maxLen),
			actualNumerOfObjects = splitObj[utils.getBaseStoreKey(key)+"meta"].max;
		
		assert.ok(  expectedNumberOfObjects === actualNumerOfObjects , "expected number " + expectedNumberOfObjects + " actual "+ actualNumerOfObjects);
	}	
});

QUnit.test("basic Hash function returns number" , function( assert){
	var str = 'A string with some stuff abcdefghijklmnopqrstuvwxyz0123456789(){}[]""-+=*&^%$#@!;:,';
	var x = utils.basicHash(str);
	assert.equal(typeof x, 'number');
});

QUnit.test("objects are reconstructed correctly", function( assert){

	var splitObj = utils.splitIntoChunks(testObj, maxLen);
	var reconstructed = utils.reconstructFromChunks(splitObj);
	
	var hashAfter = utils.basicHash(JSON.stringify(reconstructed.a));

	assert.ok( splitObj["chss__a__meta"].hash == hashAfter, "the hash of the object is consistent before and after reconstrution");
	assert.deepEqual(testObj, reconstructed, "object is serilized, split, then reconstructed to return the orignal object");
});


QUnit.test("objects are blah blah blah", function( assert ){

});

QUnit.test("calculate the max length of object chunk correctly", function( assert ){
	var ml = 8192;

	var k = "keyoflength13";

	var ml2 = utils.calcMaxLength(k, ml);
	console.log(JSON.stringify(".").length);
	console.log(ml2);
});