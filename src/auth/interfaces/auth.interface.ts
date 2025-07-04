export interface TokenPayload {
  id: number;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface RoutePermission {
  route: string;
  roles: string[];
}

export interface ValidationResponse {
  valid: boolean;
  user?: TokenPayload;
  message?: string;
} 