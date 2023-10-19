import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { UsersService } from '#auth/users.service';

import { User } from '#schemas';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersModel: Model<User>;

  const userDto = {
    tid: 'dummy-tid',
    email: 'test@test.com',
  };
  const createdUser = {
    ...userDto,
    _id: expect.any(Object),
    __v: expect.any(Number),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn().mockResolvedValue(createdUser),
            findOne: jest.fn().mockResolvedValue(createdUser),
            exec: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('when find user by tid and email', () => {
    it('should be defined', () => {
      expect(usersService.findByTidAndEmail).toBeDefined();
    });

    describe('and user is found', () => {
      beforeEach(() => {
        jest.spyOn(usersModel, 'findOne').mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(createdUser),
        } as any);
      });
      it('should return found user', async () => {
        expect(await usersService.findByTidAndEmail()).toEqual(createdUser);
      });
    });
  });

  describe('when create dummy user', () => {
    it('should be defined', () => {
      expect(usersService.createDummyUser).toBeDefined();
    });

    describe('and user is found', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByTidAndEmail').mockResolvedValueOnce(createdUser);
      });
      it('should return found user', async () => {
        expect(await usersService.createDummyUser()).toEqual(createdUser);
      });
    });

    describe('and user is created', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByTidAndEmail').mockResolvedValueOnce(null);
      });
      it('should return created user', async () => {
        expect(await usersService.createDummyUser()).toMatchObject(createdUser);
      });
    });
  });
});
