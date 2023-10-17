const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const util = require('util');
const AWS = require('aws-sdk');

console.log('Imported multer, util and AWS');


const AwsAccessKeyId = process.env.AWS_S3_ACCESS_ID || '';
const AwsSecretAccessKey = process.env.AWS_S3_ACCESS_SECRET || '';
const S3Region = process.env.AWS_S3_REGION || '';
const S3Bucket = process.env.AWS_S3_BUCKET || '';
const S3UploadAcl = 'public-read';
const S3FileDomain = 'https://d3sb74ylj0qgyo.cloudfront.net/';
const maxFileSize = 10 * 1024 * 1024;

const params = {
  Bucket: 'onestore', // Specify the bucket name here
  Key: 'img1.jpeg', // Specify the object key if needed
};

function constructRelativeFilePath(req) {
  return req.userId + '/' + req.file.originalname;
}

async function uploadFileToS3(req, res) {
  console.log('Entered uploadFileToS3 function');
  const storage = multer.memoryStorage();
  const uploadToStorage = multer({
    storage: storage,
    limits: {fileSize: maxFileSize}},
  ).single('file');
  const uploadToStoragePromise = util.promisify(uploadToStorage);

  const s3Bucket = new AWS.S3({
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    region: S3Region,
  });
  console.log('s3Bucket is defined');
  console.log('s3Bucket is '+s3Bucket);
  try {
    console.log('Inside try block of createfile');
    s3Bucket.getObject(params, (err, data) => {
      console.log('Inside getObject of S3');
      if (err) {
        console.error('Error accessing S3:', err);
      } else {
        console.log('Successfully accessed S3:', data);
      }
    });
    await uploadToStoragePromise(req, res);
    console.log('End of try block of createfile');
  } catch (err) {
    console.error('multer error' + err);
    throw err;
  }


  // Upload to S3
  const fileMetaInfo = {
    Bucket: S3Bucket,
    Key: constructRelativeFilePath(req),
    Body: req.file.buffer,
    ContentType: 'multipart/form-data',
    ACL: S3UploadAcl,
  };
  console.log('fileMetaInfo is defined');
  console.log('fileMetaInfo is '+fileMetaInfo);

//   let s3Bucket = new AWS.S3({
//       accessKeyId: AwsAccessKeyId,
//       secretAccessKey: AwsSecretAccessKey,
//       region: S3Region
//   });
  // console.log("s3Bucket is defined");
  // console.log("s3Bucket is "+s3Bucket);
  try {
    console.log('inside try block to upload the file to S3');
    const data = await s3Bucket.upload(fileMetaInfo).promise();
    console.log(data);

    const fileUrl = S3FileDomain + constructRelativeFilePath(req);
    req.file.path = fileUrl;
  } catch (err) {
    console.error('Upload to S3 error' + err);
    throw err;
  }
}

async function deleteFileFromS3(fileUrl) {
  const fileName = fileUrl.replace(S3FileDomain, '');
  console.log('Deleting file: ' + fileName);
  const fileMetaInfo = {
    Bucket: S3Bucket,
    Key: fileName,
  };

  const s3Bucket = new AWS.S3({
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    region: S3Region,
  });
  try {
    const data = await s3Bucket.deleteObject(fileMetaInfo).promise();
  } catch (err) {
    console.error('Delete from S3 failed with error: ' + err);
    throw err;
  }
}


module.exports.uploadFileToS3 = uploadFileToS3;
module.exports.deleteFileFromS3 = deleteFileFromS3;
