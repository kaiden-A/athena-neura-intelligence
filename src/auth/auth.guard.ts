import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export const ZITADEL_ROLES_CLAIM = 'urn:zitadel:iam:org:project:roles';

export interface ZitadelRequest {
  headers: Record<string, string | undefined>;
  user?: Record<string, unknown>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly issuer: string;
  private readonly audience: string;
  private readonly requiredRole: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(private readonly configService: ConfigService) {
    this.issuer = this.configService.getOrThrow<string>('ZITADEL_ISSUER');
    this.audience = this.configService.getOrThrow<string>('ZITADEL_AUDIENCE');
    this.requiredRole =
      this.configService.get<string>('ZITADEL_REQUIRED_ROLE') ?? 'member';
    this.jwks = createRemoteJWKSet(
      new URL(this.configService.getOrThrow<string>('ZITADEL_JWKS_URI')),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ZitadelRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    let payload: Record<string, unknown>;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
      });
      payload = verifiedPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const roles = this.extractRoles(payload);
    if (!roles.includes(this.requiredRole)) {
      throw new ForbiddenException(
        `Requires the "${this.requiredRole}" role to access this resource`,
      );
    }

    request.user = payload;
    return true;
  }

  private extractRoles(payload: Record<string, unknown>): string[] {
    const rolesClaim = payload[ZITADEL_ROLES_CLAIM];

    if (typeof rolesClaim === 'object' && rolesClaim !== null) {
      return Object.keys(rolesClaim);
    }

    if (Array.isArray(rolesClaim)) {
      return rolesClaim.filter(
        (role): role is string => typeof role === 'string',
      );
    }

    return [];
  }

  private extractTokenFromHeader(request: ZitadelRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
