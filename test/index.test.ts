import { assert, SinonStub } from 'sinon';

import * as faker from 'faker';
import { read } from '../src';
import { FileProcessor } from '../src/services/fileProcessor';
import s3EventJson from './mock-data/s3-event.json';
import { loadSandbox } from './test-helper';

describe('index', () => {

  describe('read', () => {
    let handleFileStub: SinonStub;

    loadSandbox((testSandbox) => {
      handleFileStub = testSandbox.stub(FileProcessor.prototype, 'handle');
    });

    it('should get file from s3 and call handle function', async () => {
      handleFileStub.returns([]);
      await read(s3EventJson, null as any, null as any);
      assert.calledOnce(handleFileStub);
    });

    it('should not trigger if file is not csv', async () => {
      const notCsvEvent = Object.assign({} , s3EventJson);
      notCsvEvent.Records[0].s3.object.key = `${faker.system.fileName()}.txt`;
      handleFileStub.returns([]);
      await read(notCsvEvent, null as any, null as any);
      assert.notCalled(handleFileStub);
    });

  });
});
