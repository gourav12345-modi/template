export interface IUserPayload {
  _id: string;
  username: string;
  type: string;
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserPayload;
  }
}

