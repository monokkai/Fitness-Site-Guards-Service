import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, ValidationResponse, RoutePermission } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly routePermissions: RoutePermission[] = [
    { route: '/profile', roles: ['user', 'admin'] },
    { route: '/admin', roles: ['admin'] },
    { route: '/trainings', roles: ['user', 'admin'] },
    { route: '/achievements', roles: ['user', 'admin'] },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string): Promise<ValidationResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      return {
        valid: true,
        user: payload,
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Invalid token',
      };
    }
  }

  async validateRole(token: string, requiredRole: string): Promise<ValidationResponse> {
    const validation = await this.validateToken(token);
    if (!validation.valid || !validation.user) {
      return {
        valid: false,
        message: 'Invalid token',
      };
    }

    const hasRole = validation.user.roles.includes(requiredRole);
    return {
      valid: hasRole,
      user: validation.user,
      message: hasRole ? undefined : 'Insufficient permissions',
    };
  }

  async validateRoute(token: string, route: string): Promise<ValidationResponse> {
    const validation = await this.validateToken(token);
    if (!validation.valid || !validation.user) {
      return {
        valid: false,
        message: 'Invalid token',
      };
    }

    const routeConfig = this.routePermissions.find(
      (rp) => rp.route === route || route.startsWith(rp.route + '/'),
    );

    if (!routeConfig) {
      return {
        valid: true, // If route is not configured, allow access
        user: validation.user,
      };
    }

    const hasAccess = validation.user.roles.some(role => routeConfig.roles.includes(role));
    return {
      valid: hasAccess,
      user: validation.user,
      message: hasAccess ? undefined : 'Access denied to this route',
    };
  }
} 