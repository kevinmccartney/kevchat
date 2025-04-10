// global.d.ts
import 'express-session';

declare global {
  type Nullable<T> = T | null;
}

declare module 'express-session' {
  interface SessionData {
    user?: { id: number; name: string };
    cancelRedirect?: string;
    signupRedirect?: string;
    oidcAuthRedirect?: string;
  }
}
