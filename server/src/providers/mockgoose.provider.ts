import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose-fix';

export const mockgooseProvider = {
  provide: 'MockgooseToken',
  useFactory: async () => {
    (mongoose as any).Promise = global.Promise;

    // fix parallel tests, https://github.com/Mockgoose/Mockgoose/issues/22
    Mockgoose.prototype.prepareStorage = function() {
      const _this = this;
      return new Promise(function(resolve, reject) {
        Promise.all([_this.getTempDBPath(), _this.getOpenPort()]).then(promiseValues => {
          const dbPath = promiseValues[0];
          const openPort = promiseValues[1].toString();
          const storageEngine = _this.getMemoryStorageName();
          const mongodArgs = ['--port', openPort, '--storageEngine', storageEngine, '--dbpath', dbPath];
          _this.mongodHelper.mongoBin.commandArguments = mongodArgs;
          const mockConnection = () => {
            _this.mockConnectCalls(_this.getMockConnectionString(openPort));
            resolve();
          };
          _this.mongodHelper.run().then(mockConnection).catch(mockConnection);
        });
      });
    };

    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(async () => {
      await mongoose.connect('mongodb://localhost:3000/quizify-test');
    });
    return mongoose;
  }
};
