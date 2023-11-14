import { NextFunction, Request, Response } from "express"

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  return res.status(500).json({ message: error.toString() })
}

export default errorHandler
