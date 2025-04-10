import {
  Controller,
  Get,
  Inject,
  Response,
  Request,
  Post,
} from '@nestjs/common';
import { UserDto } from '../users';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('signup')
export class SignupController {
  constructor(@Inject() private readonly _http: HttpService) {}

  @Get()
  async signUpPage(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    const cancelRedirect =
      req.session.cancelRedirect ?? req.query.cancelRedirect;
    const oidcAuthRedirect =
      req.session.oidcAuthRedirect ?? req.query.oidcAuthRedirect;

    if (!oidcAuthRedirect) {
      return res.status(400).render('error', {
        errorMessage: 'Missing oidc auth redirect URL',
      });
    }

    return res.status(200).render('signup', {
      oidcAuthRedirect: oidcAuthRedirect,
      cancelRedirectUrl: cancelRedirect ?? null,
    });
  }

  // @Get()
  // async succcess(
  //   @Response() res: ExpressResponse,
  //   @Request() req: ExpressRequest,
  // ) {
  //   const { cancelRedirectUrl, successRedirectUrl } = req.query;
  //   if (!successRedirectUrl) {
  //     return res.status(400).render('error', {
  //       errorMessage: 'Missing success redirect URL',
  //     });
  //   }
  //   return res.status(200).render('signup', {
  //     successRedirectUrl: successRedirectUrl,
  //     cancelRedirectUrl: cancelRedirectUrl ?? null,
  //   });
  // }

  @Post()
  async userSignUp(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    try {
      // const userCreate = await this._usersService.createUser(req.body);
      const userCreate = await firstValueFrom(
        this._http.post<UserDto>('http://kevchat_idp:4000/users', req.body),
      );

      return res.status(201).json(userCreate.data);
    } catch (err) {
      console.error('Error creating user during signup', err);

      return res.status(500).json({
        error: 'Internal server error',
        message: err.message ? err.message : 'An unexpected error occurred',
      });
    }
  }
}
