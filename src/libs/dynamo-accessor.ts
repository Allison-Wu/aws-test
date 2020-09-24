/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DataMapper, DataMapperConfiguration, PutOptions, QueryOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB, SharedIniFileCredentials } from 'aws-sdk';
import * as _ from 'lodash';
import { awsConfig } from '../config';

const dynamoOptions: DynamoDB.ClientConfiguration = {};

// credentials only for local debugging
if (!_.isEmpty(awsConfig.profile)) {
  console.log(`Creating credentials for profile [${awsConfig.profile}]`);
  dynamoOptions.credentials = new SharedIniFileCredentials({ profile: awsConfig.profile });
  dynamoOptions.region = awsConfig.region;
}

const dynamoClient = new DynamoDB(dynamoOptions);

const mapperOptions: DataMapperConfiguration = {
  client: dynamoClient,
};

const defaultMapper = new DataMapper(mapperOptions);

export class DynamoAccessor<T> {
  public mapper: DataMapper;
  protected name: string;
  protected model: new () => T;

  constructor(model: new () => T, mapper?: DataMapper) {
    this.mapper = mapper || defaultMapper;
    this.model = model;
  }

  async query(where: Partial<T>, options?: QueryOptions) {
    // const newWhere = Object.assign<T, Partial<T>>(new this.Model(), where);
    const results: T[] = [];
    for await (const result of this.mapper.query(this.model, where, options)) {
      results.push(_.omit(result as any, ['mapper']));
    }
    return results;
  }

  async put(options?: PutOptions) {
    await this.mapper.put(this, options);
  }

  get tableName() {
    return this.name;
  }
}
