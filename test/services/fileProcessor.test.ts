import { S3 } from 'aws-sdk';
import { expect } from 'chai';
import { assert, SinonStub } from 'sinon';

import * as faker from 'faker';
import { readFileSync } from 'fs';
import { DynamoAccessor } from '../../src/libs/dynamo-accessor';
import { SingleInstances } from '../../src/libs/single-instances';
import { FileProcessor } from '../../src/services/fileProcessor';
import { loadSandbox } from '../test-helper';

describe('FileProcessor', () => {
  const fileProcessor = SingleInstances.fileProcessor;

  describe('handle', () => {
    let getObjectStub: SinonStub;
    let saveRecordStub: SinonStub;
    const s3Data = {
      Body: {
        toString: () => readFileSync(`${__dirname}/../mock-data/example.csv`).toString('utf-8'),
      },
    };

    loadSandbox((testSandbox) => {
      saveRecordStub = testSandbox.stub((FileProcessor as any).prototype, 'saveRecord');
      getObjectStub = testSandbox.stub((S3 as any).services['2006-03-01'].prototype, 'getObject');
    });

    it('should get file from s3 and call saveRecord with proper columns', async () => {
      getObjectStub.returns({ promise: () => s3Data });

      await fileProcessor.handle(faker.system.fileName(), faker.system.fileName());
      assert.calledOnce(getObjectStub);
      assert.calledOnce(saveRecordStub);

      const extractedData = saveRecordStub.args[0][0].data;
      expect(extractedData.length).to.eqls(9);
      for (const row of extractedData) {
        expect(row).haveOwnProperty('latitude');
        expect(row).haveOwnProperty('longitude');
        expect(row).haveOwnProperty('address');
      }
    });
  });

  describe('saveRecord', () => {
    let dynamoPutStub: SinonStub;

    loadSandbox((testSandbox) => {
      dynamoPutStub = testSandbox.stub(DynamoAccessor.prototype, 'put');
    });

    it('should push task for calling dynamo with 1 extracted result', () => {
      const tasks: Array<Promise<void>> = [];
      const results = {
        data: [{
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          address: faker.address.secondaryAddress(),
        }],
      };
      dynamoPutStub.resolves('success');

      (fileProcessor as any).saveRecord(results, tasks);
      expect(dynamoPutStub.callCount).eq(1);
      expect(tasks.length).eq(1);
    });
  });
});
