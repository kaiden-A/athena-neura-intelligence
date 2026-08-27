import { ConfigService } from '@nestjs/config';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jose from 'jose';
import { AuthGuard, ZitadelRequest } from './auth.guard';

describe('AuthGuard', () => {
  const mockConfigService = {
    getOrThrow: (key: string) => {
      const values: Record<string, string> = {
        ZITADEL_ISSUER: 'https://example.zitadel.cloud',
        ZITADEL_AUDIENCE: '12345',
        ZITADEL_JWKS_URI: 'https://example.zitadel.cloud/oauth/v2/keys',
      };
      if (!(key in values)) {
        throw new Error(`Missing config key: ${key}`);
      }
      return values[key];
    },
    get: () => undefined,
  } as unknown as ConfigService;

  const createContext = (request: ZitadelRequest): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(new AuthGuard(mockConfigService)).toBeDefined();
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    const guard = new AuthGuard(mockConfigService);
    await expect(
      guard.canActivate(createContext({ headers: {} })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for an invalid token', async () => {
    jest.spyOn(jose, 'jwtVerify').mockRejectedValueOnce(new Error('invalid'));

    const guard = new AuthGuard(mockConfigService);
    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer invalid-token' } }),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException when the required role is missing', async () => {
    jest
      .spyOn(jose, 'jwtVerify')
      .mockResolvedValueOnce({ payload: { sub: 'user-1' } } as never);

    const guard = new AuthGuard(mockConfigService);
    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer valid-token' } }),
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow access and attach the user when the member role is present', async () => {
    jest.spyOn(jose, 'jwtVerify').mockResolvedValueOnce({
      payload: {
        sub: 'user-1',
        'urn:zitadel:iam:org:project:roles': {
          member: { '12345': 'example.zitadel.cloud' },
        },
      },
    } as never);

    const guard = new AuthGuard(mockConfigService);
    const request: ZitadelRequest = {
      headers: { authorization: 'Bearer valid-token' },
    };
    const context = createContext(request);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user?.sub).toBe('user-1');
    expect(request.user?.id).toBe('user-1');
  });
});
