require('dotenv').load();

var Aws = require('aws-sdk');
var sinon = require('sinon');

// Only works for 'createBucket', 'update' and a few others since most API methods are generated 
// dynamically upon instantiation. Very counterintuitive.
var createBucket = sinon.stub(Aws.S3.prototype, 'createBucket');
createBucket.yields(null, 'Me create bucket');

// For other methods, we can 'assign' the stubs to the proto, already defined functions won't be 
// replaced with dynamically generated ones
var listBuckets = Aws.S3.prototype.listBuckets = sinon.stub();
listBuckets.yields(null, 'Me list buckets');

var s3 = new Aws.S3();
s3.createBucket({Bucket: 'my-bucket'}, function(err, arg1) {
    console.log(arg1);
});
s3.listBuckets(function(err, arg1) {
    console.log(arg1);
});

// Look Ma', it works!
console.log('Called #createBucket() ' + s3.createBucket.callCount + ' time(s)');
console.log('Called #listBuckets() ' + s3.listBuckets.callCount + ' time(s)');
