import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateTokenDto, ValidateRoleDto, ValidateRouteDto } from './dto/auth.dto';
import { ValidationResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate-token')
  async validateToken(@Body() dto: ValidateTokenDto): Promise<ValidationResponse> {
    const result = await this.authService.validateToken(dto.token);
    if (!result.valid) {
      throw new UnauthorizedException(result.message);
    }
    return result;
  }

  @Post('validate-role')
  async validateRole(@Body() dto: ValidateRoleDto): Promise<ValidationResponse> {
    const result = await this.authService.validateRole(dto.token, dto.role);
    if (!result.valid) {
      throw new UnauthorizedException(result.message);
    }
    return result;
  }

  @Post('validate-route')
  async validateRoute(@Body() dto: ValidateRouteDto): Promise<ValidationResponse> {
    const result = await this.authService.validateRoute(dto.token, dto.route);
    if (!result.valid) {
      throw new UnauthorizedException(result.message);
    }
    return result;
  }
} 