import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { isEmpty } from 'lodash';
import * as Papa from 'papaparse';
import { awsConfig, IAwsConfig } from '../config';
import { Location } from '../models/Location';

export class FileProcessor {
  private s3: S3;

  constructor(config: IAwsConfig = awsConfig) {
    const s3Options: S3.ClientConfiguration = {};
    // credentials only for local debugging
    if (!isEmpty(config.profile)) {
      console.log(`Creating credentials for profile [${config.profile}]`);
      s3Options.credentials = new SharedIniFileCredentials({ profile: config.profile });
      s3Options.region = config.region;
    }
    this.s3 = new S3(s3Options);
  }

  public async handle(bucketName: string, fileName: string) {
    const targetData = await this.s3.getObject({
      Bucket: bucketName,
      Key: fileName,
    }).promise();

    const insertDbTasks: Array<Promise<void>> = [];
    await new Promise((resolve, reject) => {
      Papa.parse<Location>(
        targetData.Body && targetData.Body.toString(),
        {
          chunkSize: 1024,
          header: true,
          chunk: results => this.saveRecord(results, insertDbTasks),
          complete: () => resolve(),
          error: err => reject(err),
        },
      );
    });

    await Promise.all(insertDbTasks);
    return;
  }

  private saveRecord(results: Papa.ParseResult<Location>, tasks: Array<Promise<void>>) {
    for (const row of results.data) {
      const location = new Location();
      location.latitude = row.latitude;
      location.longitude = row.longitude;
      location.address = row.address;
      tasks.push(location.put());
    }
  }
}
