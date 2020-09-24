import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { isEmpty } from 'lodash';
import { awsConfig, IAwsConfig } from '../config';

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
    const target = await this.s3.getObject({
      Bucket: bucketName,
      Key: fileName,
    });
    // papaparser handle record
    // save db
    return;
  }
}
