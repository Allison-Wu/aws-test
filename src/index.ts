import { S3Handler } from 'aws-lambda';
import { SingleInstances } from './libs/single-instances';

export const read: S3Handler = async (event) => {
  try {
    const tasks: Array<Promise<void>> = [];
    event.Records.forEach(record => {
      if (record.eventSource === 'aws:s3' && record.eventName === 'ObjectCreated:Put') {
        const fileName = record.s3.object.key;
        const bucketName = record.s3.bucket.name;
        if (/\.csv$/i.test(fileName)) {
          return tasks.push(SingleInstances.fileProcessor.handle(bucketName, fileName));
        }
        console.log(`Skip record for file[${fileName}]`);
      }
      console.log(`Skip record which is not S3 put event. record: ${JSON.stringify(record)}`);
    });
    await Promise.all(tasks);
  } catch (error) {
    console.log(error);
  }
};
