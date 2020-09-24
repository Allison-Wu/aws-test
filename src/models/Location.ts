import {
  attribute,
  autoGeneratedHashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { dynamodbConfig } from '../config';
import { DynamoAccessor } from '../libs/dynamo-accessor';

@table(dynamodbConfig.location)
export class Location extends DynamoAccessor<Location> {

  @autoGeneratedHashKey()
  id?: string;

  @attribute()
  latitude?: string;

  @attribute()
  longitude?: string;

  @attribute()
  address?: string;

  @rangeKey({defaultProvider: () => new Date()})
    createdAt: Date;

  constructor() {
    super(Location);
    this.name = dynamodbConfig.location;
  }
}