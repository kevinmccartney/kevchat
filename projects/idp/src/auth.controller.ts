import {
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Response,
  Req,
  Res,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  private async introspectToken(token: string) {
    try {
      const response = await axios.post(
        'http://kevchat_idp:4000/oidc/token/introspection',
        new URLSearchParams({
          token,
          client_id: 'kevchat-app',
        }),
      );

      if (response.data.active) {
        console.log('Token is valid');
        return true;
      } else {
        console.log('Token is invalid or expired');
        return false;
      }
    } catch (error) {
      console.error('Error during token introspection:', error.message);
      return false;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('login')
  async login(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    if (!req.query.oidcAuthRedirect) {
      return res.status(400).render('error', {
        errorMessage: 'Missing oidc auth redirect URL',
      });
    }

    function isUrlOnDomain(
      urlString: string,
      allowedDomains: string[],
    ): boolean {
      try {
        const url = new URL(urlString);
        const hostname = url.hostname;

        return allowedDomains.some(
          (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
        );
      } catch {
        return false;
      }
    }

    const allowedCancelRedirectDomains =
      process.env.KEVCHAT_IDP_ALLOWED_CANCEL_REDIRECT_DOMAINS?.split(',') || [];
    const allowedOidcAuthRedirectDomains =
      process.env.KEVCHAT_IDP_ALLOWED_OIDC_AUTH_REDIRECT_DOMAINS?.split(',') ||
      [];
    const allowedSignupRedirectDomains =
      process.env.KEVCHAT_IDP_ALLOWED_SIGNUP_REDIRECT_DOMAINS?.split(',') || [];

    const cancelRedirectIsAllowed = isUrlOnDomain(
      decodeURIComponent((req.query.cancelRedirect as string) ?? ''),
      allowedCancelRedirectDomains,
    );
    const oidcAuthRedirectIsAllowed = isUrlOnDomain(
      decodeURIComponent((req.query.oidcAuthRedirect as string) ?? ''),
      allowedOidcAuthRedirectDomains,
    );
    const signupRedirectIsAllowed = isUrlOnDomain(
      decodeURIComponent((req.query.signupRedirect as string) ?? ''),
      allowedSignupRedirectDomains,
    );

    if (
      !cancelRedirectIsAllowed ||
      !oidcAuthRedirectIsAllowed ||
      !signupRedirectIsAllowed
    ) {
      return res.status(400).render('error', {
        errorMessage: 'Invalid redirect URL',
      });
    }

    req.session.cancelRedirect = decodeURIComponent(
      req.query.cancelRedirect as string,
    );
    req.session.signupRedirect = decodeURIComponent(
      req.query.signupRedirect as string,
    );
    req.session.oidcAuthRedirect = decodeURIComponent(
      req.query.oidcAuthRedirect as string,
    );

    req.session.save();

    return res.status(302).redirect(req.session.oidcAuthRedirect as string);
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    console.log(req.session.cancelRedirect);

    return res.status(200).json({
      message: 'Logout successful',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('validate')
  async validate(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

    const tokenValidation = await this.introspectToken(token);

    return tokenValidation
      ? res.status(200).json({ message: 'Token is valid' })
      : res.status(401).json({
          message: 'Token is invalid or expired',
        });
  }
}
