import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

export const mockgooseProvider = {
  provide: 'MockgooseToken',
  useFactory: async () => {
    (mongoose as any).Promise = global.Promise;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(async () => {
      await mongoose.connect('mongodb://localhost:3000/quizify-test');
    });
    return mongoose;
  }
};
