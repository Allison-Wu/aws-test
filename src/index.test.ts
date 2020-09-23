import { assert, SinonStub } from 'sinon';
import { loadSandbox } from '../lib/test-helper';

describe('Test', () => {

  describe('#index', () => {
    // let testStub: sinon.SinonStub;

    loadSandbox((testSandbox) => {
      // testStub = testSandbox.stub(xxclass.prototype, 'functionName');
    });

    it('should run', async () => {
      // assert.calledOnce(testStub);
    });
  });
});
