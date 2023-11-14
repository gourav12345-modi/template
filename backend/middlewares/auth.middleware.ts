import jwt, { VerifyErrors } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    // verify token
    jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: VerifyErrors | null, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decodedToken;
      next();
    });
  } else {
    // token is not present
    return res.status(401).json({ message: 'Token not found' });
  }
}

export default auth;
