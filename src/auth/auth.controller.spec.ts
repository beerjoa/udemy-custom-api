import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '#auth/auth.controller';
import { AuthService } from '#auth/auth.service';
import { LoginResponseDto } from '#auth/dto/login.dto';
import { UserPayloadDto } from '#auth/dto/verify.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  const accessToken = 'test-access-token';
  const loginRequestUser = {
    email: 'test@test.com',
    tid: 'test',
  };

  const loginResponseDto: LoginResponseDto = {
    ...loginRequestUser,
    access_token: expect.any(String),
  };

  const userPayload: UserPayloadDto = {
    ...loginRequestUser,
    iat: expect.any(Number),
    exp: expect.any(Number),
  };

  beforeEach(async () => {
    authService = {
      login: () => Promise.resolve(loginResponseDto),
      logout: () => Promise.resolve(userPayload),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('when login user', () => {
    it('should be defined', () => {
      expect(authController.login).toBeDefined();
    });

    describe('and login is successful', () => {
      it('should return login response', async () => {
        expect(await authController.login(userPayload)).toEqual(loginResponseDto);
      });
    });
  });

  describe('when verify user', () => {
    it('should be defined', () => {
      expect(authController.getJwtAuth).toBeDefined();
    });

    describe('and verify is successful', () => {
      it('should return user payload', () => {
        expect(authController.getJwtAuth(userPayload)).toEqual(userPayload);
      });
    });
  });

  describe('when logout user', () => {
    it('should be defined', () => {
      expect(authController.logout).toBeDefined();
    });

    describe('and logout is successful', () => {
      beforeEach(() => {
        // jest.spyOn(authController
      });
      it('should return user payload', async () => {
        expect(await authController.logout(userPayload, accessToken)).toEqual(userPayload);
      });
    });
  });
});
