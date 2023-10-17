const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIA2WQHFGYVYH2HWFUF',
  secretAccessKey: 'YI6rZyfWSRipZnYAfpXvFTNT89BKVQqmU6rR',
  region: 'us-west-1' // Replace with the correct AWS region
});

const s3 = new AWS.S3();

const params = {
  Bucket: 'onestore', // Specify the bucket name here
  Key: 'img1.jpeg'      // Specify the object key if needed
};

s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Error accessing S3:', err);
    } else {
      console.log('Successfully accessed S3:', data);
    }
  });