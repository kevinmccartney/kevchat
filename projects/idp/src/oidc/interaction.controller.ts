import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Response,
} from '@nestjs/common';
import {
  InjectOidcProvider,
  InteractionHelper,
  OidcInteraction,
  Provider,
} from 'nest-oidc-provider';
import { Response as ExpressResponse } from 'express';
import { pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import { UsersService } from '../users';

@Controller('/interaction')
export class InteractionController {
  private readonly logger = new Logger(InteractionController.name);

  constructor(
    @InjectOidcProvider() private readonly provider: Provider,
    @Inject() private readonly _usersService: UsersService,
  ) {}

  @Get(':uid')
  async doInteraction(
    @OidcInteraction() interaction: InteractionHelper,
    @Response() res: ExpressResponse,
  ) {
    try {
      const { prompt, params, uid } = await interaction.details();
      const client = await this.provider.Client.find(
        params.client_id as string,
      );

      return res.status(200).render(prompt.name, {
        details: prompt.details,
        client,
        params,
        uid,
        errorMessage: null,
      });
    } catch (err) {
      console.error('Error while getting interaction', err);

      return res.status(500).render('error', {
        errorMessage: err.error_description || err.message,
      });
    }
  }

  @Post(':uid/login')
  async loginCheck(
    @OidcInteraction() interaction: InteractionHelper,
    @Body() form: Record<string, string>,
    @Response() res: ExpressResponse,
  ) {
    const { prompt, params, uid } = await interaction.details();
    const client = await this.provider.Client.find(params.client_id as string);

    if (!form.username || !form.password) {
      let errorMessage = 'Required fields missing: ';

      if (!form.username) {
        errorMessage += " 'username' ";
      } else if (!form.password) {
        errorMessage += " 'password' ";
      }

      return res.status(400).render(prompt.name, {
        details: prompt.details,
        client,
        params,
        uid,
        errorMessage: errorMessage.trim(),
      });
    }

    try {
      const user = await this._usersService.findByUsername(form.username);

      if (!user) {
        return res.status(401).render(prompt.name, {
          details: prompt.details,
          client,
          params,
          uid,
          errorMessage: 'Incorrect username or password.',
        });
      }

      const pbkdf2Async = promisify(pbkdf2);
      const userCredentials = await this._usersService.getHashedPassword(
        user._id.toString(),
      );

      try {
        const hashedPassword = await pbkdf2Async(
          form.password,
          userCredentials.salt.buffer,
          310000,
          32,
          'sha256',
        );

        if (
          !timingSafeEqual(
            userCredentials.hashedPassword.buffer,
            hashedPassword,
          )
        ) {
          return res.status(401).render(prompt.name, {
            details: prompt.details,
            client,
            params,
            uid,
            errorMessage: 'Incorrect username or password.',
          });
        }

        await interaction.finished(
          {
            login: {
              accountId: user._id.toString(),
              username: user.username,
            },
          },
          { mergeWithLastSubmission: false },
        );
      } catch (err) {
        console.error('Error hashing password:', err);

        return res.status(500).render('login', {
          details: prompt.details,
          client,
          params,
          uid,
          errorMessage: 'Internal server error. Please try again.',
        });
      }
    } catch (err) {
      console.error('Error fetching user from database:', err);

      return res.status(500).render('login', {
        details: prompt.details,
        client,
        params,
        uid,
        errorMessage: 'Internal server error. Please try again.',
      });
    }
  }

  @Post(':uid/confirm')
  async confirmLogin(@OidcInteraction() interaction: InteractionHelper) {
    const interactionDetails = await interaction.details();
    const { prompt, params, session } = interactionDetails;
    let { grantId } = interactionDetails;

    const grant = grantId
      ? await this.provider.Grant.find(grantId)
      : new this.provider.Grant({
          accountId: session.accountId,
          clientId: params.client_id as string,
        });

    if (prompt.details.missingOIDCScope) {
      const scopes = prompt.details.missingOIDCScope as string[];
      grant.addOIDCScope(scopes.join(' '));
    }

    if (prompt.details.missingOIDCClaims) {
      grant.addOIDCClaims(prompt.details.missingOIDCClaims as string[]);
    }

    if (prompt.details.missingResourceScopes) {
      for (const [indicator, scopes] of Object.entries(
        prompt.details.missingResourceScopes,
      )) {
        grant.addResourceScope(indicator, scopes.join(' '));
      }
    }

    grantId = await grant.save();

    await interaction.finished(
      {
        consent: {
          grantId,
        },
      },
      { mergeWithLastSubmission: true },
    );
  }

  @Get(':uid/abort')
  async abortLogin(
    @OidcInteraction() interaction: InteractionHelper,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-user aborted interaction',
      };

      await interaction.finished(result, { mergeWithLastSubmission: false });
    } catch (err) {
      this.logger.error(`Failed to abort interaction`, err);

      return res.status(500).render('error', {
        errorMessage: 'Internal server error. Please try again.',
      });
    }
  }
}
