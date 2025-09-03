import { NextFunction, Request, Response } from 'express'

// export const catchAsync = (fn: any) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res).catch((err: any) => next(err))
//   }
// } 

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
