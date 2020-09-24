import { expect } from 'chai';
import * as faker from 'faker';
import { assert, SinonStub } from 'sinon';

import { read } from '../src/api-gateway';
import { DynamoAccessor } from '../src/libs/dynamo-accessor';
import { loadSandbox } from './test-helper';

describe('api-gateway-handler', () => {

  describe('read', () => {
    let dynamoQueryStub: SinonStub;
    const withIdEvent: any = { pathParameters: { id: faker.random.uuid() } };

    loadSandbox((testSandbox) => {
      dynamoQueryStub = testSandbox.stub(DynamoAccessor.prototype, 'query');
    });

    it('should return location if record found', async () => {
      const dynamoRecords = [{
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
        address: faker.address.secondaryAddress(),
      }];
      dynamoQueryStub.returns(dynamoRecords);

      const response = await read(withIdEvent);
      assert.calledOnce(dynamoQueryStub);
      expect(response.statusCode).eq(200);
      expect(response.statusCode).eq(200);
      expect(JSON.parse(response.body)).eql(dynamoRecords);
    });

    it('should return 404 if record not found', async () => {
      dynamoQueryStub.returns([]);

      const response = await read(withIdEvent);
      assert.calledOnce(dynamoQueryStub);
      expect(response.statusCode).eq(404);
      expect(response.body).eq(`Location[${withIdEvent.pathParameters.id}] not found`);
    });

    it('should return 400 if id does not exist in pathParameters', async () => {
      dynamoQueryStub.returns([]);

      const response = await read(({ pathParameters: {} } as any));
      assert.notCalled(dynamoQueryStub);
      expect(response.statusCode).eq(400);
      expect(response.body).eq('Location id is empty');
    });

  });
});
