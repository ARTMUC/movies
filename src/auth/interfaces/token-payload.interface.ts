export interface TokenPayload {
  userId: number;
  name: string;
  role: 'basic' | 'premium';
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}
