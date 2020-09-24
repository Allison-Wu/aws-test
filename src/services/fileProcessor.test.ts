import { S3 } from 'aws-sdk';
import { expect } from 'chai';
import { assert, SinonStub } from 'sinon';

import { readFileSync } from 'fs';
import { DynamoAccessor } from '../libs/dynamo-accessor';
import { SingleInstances } from '../libs/single-instances';
import { loadSandbox } from '../libs/test-helper';
import { FileProcessor } from './fileProcessor';

describe('FileProcessor', () => {
  const fileProcessor = SingleInstances.fileProcessor;

  describe('handle', () => {
    let getObjectStub: SinonStub;
    let saveRecordStub: SinonStub;
    const s3Data = {
      Body: {
        toString: () => readFileSync(`${__dirname}/../libs/test-data/test.csv`).toString('utf-8'),
      },
    };

    loadSandbox((testSandbox) => {
      saveRecordStub = testSandbox.stub((FileProcessor as any).prototype, 'saveRecord');
      getObjectStub = testSandbox.stub((S3 as any).services['2006-03-01'].prototype, 'getObject');
    });

    it('should get file from s3 and call saveRecord with proper columns', async () => {
      getObjectStub.returns({ promise: () => s3Data });

      await fileProcessor.handle('BucketName', 'FileName');
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
          latitude: -43.58299805,
          longitude: 146.89373497,
          address: '840 COCKLE CREEK RD, RECHERCHE TAS 7109',
        }],
      };
      dynamoPutStub.resolves('success');

      (fileProcessor as any).saveRecord(results, tasks);
      expect(dynamoPutStub.callCount).eq(1);
      expect(tasks.length).eq(1);
    });
  });
});
