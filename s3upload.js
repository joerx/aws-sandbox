require('dotenv').load();

var Aws = require('aws-sdk');
var uniqid = require('uniqid');
var fs = require('fs');
var s3 = new Aws.S3();

const BUCKET = process.env.AWS_S3_BUCKET;

function bail(err) {
  throw err;
}

/**
 * Upload file to s3. First parameter is assumed to be a stream.Readable
 */
function upload(stream, fn) {

  /* Does the actual upload */
  function doUpload() {
    var params = {
      Key: uniqid(),
      Bucket: BUCKET,
      Body: stream,
      ContentType: 'image/jpg'
    }
    console.log('\nuploading:');
    s3.upload(params)
      .on('httpUploadProgress', function(evt) {
        console.log('-', evt.loaded, '/', evt.total);
      })
      .send(function(err, data) {
        if (err) return fn(data);
        console.log('\nupload complete:');
        console.log(data);
        fn(null, {
          key: params.Key,
          location: data.Location,
          etag: data.ETag
        });
      });
  }

  // check if bucket exists, if yes, upload, if not, bail out
  s3.headBucket({Bucket: BUCKET}, function(err) {
    if (err && err.statusCode === 404) fn(Error('Bucket does not exist'));
    else if (err) fn(err);
    else doUpload();
  }); 
}

function getInfo(key, fn) {
  s3.headObject({Bucket: BUCKET, Key: key}, function(err, data) {
    if (err && err.statusCode === 404) fn(Error('No object with key ' + key));
    else if (err) fn(err);
    else fn(null, data);
  });
}

var stream = fs.createReadStream(__dirname + '/sample.jpg');
upload(stream, function(err, data) {
  if (err) return bail(err);

  console.log('\ndid upload:')
  console.log(data);
  var key = data.key;

  getInfo(key, function(err, data) {
    if (err) return bail(err);
    console.log('\nobject info:');
    console.log(data);
  });

  getInfo('foo', function(err, data) {
    console.log('\nunknown object:')
    console.log(err);
  });

});
