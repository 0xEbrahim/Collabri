import { USER_ROLE } from 'src/modules/user/entities/user.entity';

export interface IEmail {
  from: string;
  to: string;
  subject: string;
  template: string;
  data: any;
}

export interface IResponse {
  statusCode: number;
  message?: string;
  data?: any;
  token?: any;
  refreshToken?: any;
  page?: number;
  size?: number;
}

export interface JwtPayload {
  id: number;
  role: USER_ROLE;
}

export interface PassportUser {
  email: string;
  avatar: string;
  name: string;
  provider: string;
  id: string;
}
