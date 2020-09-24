import { FileProcessor } from '../services/fileProcessor';

export class SingleInstances {
  public static fileProcessor = new FileProcessor();
}
