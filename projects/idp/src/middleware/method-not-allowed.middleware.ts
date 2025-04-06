import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  Application as ExpressApp,
  NextFunction,
  Request,
  Response,
} from 'express';
import { match } from 'path-to-regexp';

@Injectable()
export class MethodNotAllowedMiddleware implements NestMiddleware {
  private allowedMethodsMap: Record<string, string[]> = {};

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  onApplicationBootstrap() {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (httpAdapter && httpAdapter.getInstance) {
      const expressApp: ExpressApp = httpAdapter.getInstance();
      const router = expressApp.router;
      const stack = (router as any).stack;

      stack.forEach((layer: any) => {
        if (layer.route) {
          const path = layer.route.path;
          const methods = Object.keys(layer.route.methods).map((m) =>
            m.toUpperCase(),
          );
          this.allowedMethodsMap[path] = this.allowedMethodsMap[path]
            ? [...this.allowedMethodsMap[path], ...methods]
            : methods;
        }
      });
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    const baseUrl = req.baseUrl;
    const method = req.method.toUpperCase();

    const routeMatch: string | null = Object.keys(this.allowedMethodsMap).find(
      (x) => {
        const matcher = match(x, { decode: decodeURIComponent });

        const isMatch = matcher(baseUrl);

        if (isMatch) {
          return true;
        }
      },
    );

    if (
      routeMatch &&
      this.allowedMethodsMap[routeMatch] &&
      !this.allowedMethodsMap[routeMatch].includes(method)
    ) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    next();
  }
}
