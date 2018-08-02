import { Test } from '@nestjs/testing';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { Mockgoose } from "mockgoose-fix";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
import { UserException } from '../../common/user.exception';
import { UserService } from './user.service';
import { UserSchema } from '../schemas/user.schema';

let mockgoose: Mockgoose = new Mockgoose(mongoose)

describe('UserService', () => {
  let userService: UserService;

  const userProvider = {
    provide: getModelToken('User'),
    useFactory: async connection => connection.model('user', UserSchema),
    inject: [mockgooseProvider.provide],
  } as any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        mockgooseProvider,
        userProvider,
        UserService
      ]
    }).compile()

    userService = module.get<UserService>(UserService)
  })

  describe('create', () => {
    it('should create a user', async () => {
      const user = await userService.create('user-name', 'access-token', 'refresh-token')

      expect(user.name).toBe('user-name')
      expect(user.spotifyAccessToken).toBe('access-token')
      expect(user.spotifyRefreshToken).toBe('refresh-token')
    })
  })

  describe('getById', () => {
    it('should get a single user with correct id', async () => {
      const user = await userService.create('user-name', 'access-token', 'refresh-token')

      const actualUser = await userService.getById(user._id)

      expect(actualUser._id).toEqual(user._id)
    })
  })

  afterAll(async () => {
    await mockgoose.helper.reset();
    await mongoose.disconnect();
    await mockgoose.mongodHelper.mongoBin.childProcess.on('exit', () => {
      mockgoose.mongodHelper.mongoBin.childProcess.kill('SIGTERM');
    });
  })
})
