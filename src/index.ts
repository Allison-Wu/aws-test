import { S3Handler } from 'aws-lambda';

export const read: S3Handler = async (event) => {
  try {
    const task = [];
    event.Records.forEach(record => {
      if (record.eventSource === 'aws:s3' && record.eventName === 'ObjectCreated:Put') {
        const fileName = record.s3.object.key;
        const bucketName = record.s3.bucket.name;
        if (/\.csv$/i.test(fileName)) {
          // return task.push();
        }
        console.log(`Skip record for file[${fileName}]`);
      }
      console.log(`Skip record which is not S3 put event. record: ${JSON.stringify(record)}`);
    });
  } catch (error) {
    console.log(error);
  }
};
