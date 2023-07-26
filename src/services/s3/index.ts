import AWS from 'aws-sdk';

// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: 'AKIATNMSO37KTJZYLPCJ',
  secretAccessKey: 'OywlmVBlGs5JI+kBKwL5Jjy/2s6Ml4/c6J4A7n3E',
  region: 'ap-south-1'
});

// Function to get a signed URL for an S3 object
export async function getSignedUrl(bucketName: string, objectKey: string, expiresInMinutes: number) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: expiresInMinutes * 60 // Convert minutes to seconds
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err: any, url: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}