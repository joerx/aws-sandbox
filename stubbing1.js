require('dotenv').load();

var Aws = require('aws-sdk');
var sinon = require('sinon');

var S3 = Aws.S3;
var Proto = Aws.S3.prototype;

Aws.S3.prototype.createBucket = sinon.stub();
Aws.S3.prototype.createBucket.yields(null, 'test');

Aws.S3.prototype.headBucket = sinon.stub();
Aws.S3.prototype.headBucket.yields(null, 'head');

//sinon.stub(Aws.S3.prototype, 'listBuckets'); // doesn't work, function not defined
Aws.S3.prototype.listBuckets = sinon.stub();
Aws.S3.prototype.listBuckets.yields(null, 'list');

var s3 = new Aws.S3();

s3.createBucket(function(err, arg) {
    if (err) return console.error(err);
    else console.log(arg);
});

s3.headBucket(function(err, arg) {
    if (err) return console.error(err);
    else console.log(arg);
});

s3.listBuckets(function(err, arg) {
    if (err) return console.error(err);
    else console.log(arg);
});

