export interface IEmail {
  from: string;
  to: string;
  subject: string;
  template: string;
  data: any;
}

export interface IResponse {
  status: string;
  statusCode: number;
  message?: string;
  data?: any;
  token?: any;
  refreshToken?: any;
  page?: number;
  size?: number;
}
