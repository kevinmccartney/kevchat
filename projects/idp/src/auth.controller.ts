import {
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Response,
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
