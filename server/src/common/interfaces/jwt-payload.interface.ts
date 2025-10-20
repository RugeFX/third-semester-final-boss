export interface JwtPayload {
  id: number;
  fullname: string;
  username: string;
  role: 'admin' | 'member'; 
  iat: number; // Issued at
  exp: number; // Expiration time
}