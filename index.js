"use strict";

const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  signatureVersion: "v4"
});
const Sharp = require("sharp");

const BUCKET = process.env.BUCKET;
// const BUCKET = 'delivery-web-api-product-image-dev';
const URL = process.env.URL;
// const URL = 'https://d9q060adfavml.cloudfront.net';
const ALLOWED_RESOLUTIONS = process.env.ALLOWED_RESOLUTIONS
  ? new Set(process.env.ALLOWED_RESOLUTIONS.split(/\s*,\s*/))
  : new Set([]);

  // (async function(event, context, callback){
exports.handler = function(event, context, callback) {
  // const key = event.queryStringParameters.key;
  // const match = key.match(/((\d+)x(\d+))\/(.*)/);

  // //Check if requested resolution is allowed
  // if (0 != ALLOWED_RESOLUTIONS.size && !ALLOWED_RESOLUTIONS.has(match[1])) {
  //   callback(null, {
  //     statusCode: "403",
  //     headers: {},
  //     body: ""
  //   });
  //   return;
  // }

  // const width = parseInt(match[2], 10);
  // const height = parseInt(match[3], 10);
  // const originalKey = match[4];

  console.log(context)
  console.log("event tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt")
  console.dir(event, { depth: null, colors: true });

  console.log("going to call S3 for get object")
  S3.getObject({ Bucket: BUCKET, Key: 'uploads/product_image/201118/file/8019428000013.jpg' })
    .promise()
    .then(data => {
      console.log("get data successfully")
      console.log(data.Body)
      return Sharp(data.Body)
      .resize(100, 100)
      .toFormat("png")
      .toBuffer()
    }
      
    )
    .then(buffer => {
      console.log("Try to put data")
      S3.putObject({
        Body: buffer,
        Bucket: BUCKET,
        ContentType: "image/png",
        Key: 'uploads/product_image/201118/file/100x100/8019428000013.jpg'
      }).promise()

      console.log("Put image to s3 successfully")
    }
    )
    .then(() =>
      callback(null, {
        statusCode: "301",
        headers: { location: `${URL}/uploads/product_image/201118/file/100x100/8019428000013.jpg` },
        body: ""
      })
    )
    .catch(err => console.error(err));
};

    // })();
