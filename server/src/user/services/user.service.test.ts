import { Test } from '@nestjs/testing';
import { mockgooseProvider } from '../../providers/mockgoose.provider';
import { Mockgoose } from "mockgoose-fix";
import * as mongoose from "mongoose";
import { getModelToken } from '@nestjs/mongoose';
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

      expect(user.id).toBe('user-name')
      expect(user.spotifyAccessToken).toBe('access-token')
      expect(user.spotifyRefreshToken).toBe('refresh-token')
    })
  })

  describe('updateAccessToken', () => {
    it('should update user with new token', async () => {
      const user = await userService.create('user-name', 'access-token', 'refresh-token')
      const actualUser = await userService.updateAccessToken('user-name', 'new-access-token')

      expect(user.spotifyAccessToken).not.toBe(actualUser.spotifyAccessToken)
      expect(actualUser.spotifyAccessToken).toBe('new-access-token')
    })
  })

  describe('getById', () => {
    it('should get a single user with correct id', async () => {
      const user = await userService.create('user-name', 'access-token', 'refresh-token')

      const actualUser = await userService.getById(user._id)

      expect(actualUser._id).toEqual(user._id)
    })
  })

  describe('getByAccessToken', () => {
    it('should get a single user with correct access token', async () => {
      const user = await userService.create('user-name', 'access-token', 'refresh-token')

      const actualUser = await userService.getByAccessToken('access-token')

      expect(actualUser.spotifyAccessToken).toBe('access-token')
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
