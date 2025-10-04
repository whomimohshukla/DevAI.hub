import { Request, Response, NextFunction } from "express";


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// A utility to wrap async route handlers and middleware to catch errors
// and pass them to the next middleware (error handler).
export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => any>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
