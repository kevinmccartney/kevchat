import {
  AdapterFactory,
  OidcConfiguration,
  OidcModuleOptions,
  OidcModuleOptionsFactory,
} from 'nest-oidc-provider';
import { Injectable } from '@nestjs/common';
import MongoAdapter from 'src/oidc/oidc-provider.adapter';
import htmlSafe from 'src/utils/htmlSafe';

@Injectable()
export class OidcConfigService implements OidcModuleOptionsFactory {
  createModuleOptions(): OidcModuleOptions | Promise<OidcModuleOptions> {
    return {
      issuer: process.env.KEVCHAT_IDP_BASE_URL,
      path: '/oidc',
      oidc: this.getConfiguration(),
      proxy: true,
    };
  }

  async createAdapterFactory(): Promise<AdapterFactory> {
    await MongoAdapter.connect();

    return (modelName: string) => new MongoAdapter(modelName);
  }

  getConfiguration(): OidcConfiguration {
    return {
      clients: [
        {
          client_id: 'kevchat-app',
          client_name: 'kevchat-app',
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          redirect_uris: [process.env.KEVCHAT_CLIENT_AUTH_LOGIN_CALLBACK_URL],
          post_logout_redirect_uris: [
            process.env.KEVCHAT_CLIENT_AUTH_LOGOUT_CALLBACK_URL,
          ],
        },
      ],
      pkce: {
        methods: ['S256'],
        required: () => false,
      },
      scopes: [
        'openid',
        'offline_access',
        'profile',
        'email',
        'phone',
        'address',
      ],
      features: {
        devInteractions: {
          enabled: false,
        },
        introspection: { enabled: true },
        revocation: { enabled: true },
        rpInitiatedLogout: {
          logoutSource: async (ctx, form) => {
            const cancelRedirectUri = ctx.query.logout_cancel_redirect_uri;
            ctx.body = `<!DOCTYPE html>
              <html>
                <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta charset="utf-8">
                  <title>Kevchat Identity | Logout Request</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                  <link href="/app.css" rel="stylesheet" type="text/css" />
                </head>
                <body>
                   <div class="h-full w-full flex flex-col justify-center items-center bg-base-300">
                    <article class="prose">
                      <h1 class="text-center">KevChat Identity</h1>
                      <div class="card card-dash bg-base-100">
                        <div class="card-body">
                          <h2 class="mt-0 mb-3">Do you want to logout?</h2>
                            ${form}
                            <button class="btn btn-primary mb-2" autofocus type="submit" form="op.logoutForm" value="yes" name="logout">Yes, log me out</button>
                            <a class="btn btn-accent btn-outline" href=${cancelRedirectUri}>No, stay logged in</a>
                        </div>
                      </div>
                   
                  </div>
                </body>
              </html>`;
          },
        },
      },
      interactions: {
        url(_, interaction) {
          return `/interaction/${interaction.uid}`;
        },
      },
      cookies: {
        keys: [process.env.KEVCHAT_IDP_OIDC_SESSION_COOKIE_KEY],
      },
      findAccount: async (_ctx, id) => {
        const sub = id;

        return {
          accountId: sub,
          async claims() {
            return { sub };
          },
        };
      },
      renderError(ctx, out, error) {
        console.error('IDP error', error);

        ctx.type = 'html';
        ctx.body = `<!DOCTYPE html>
          <html>
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <link href="/app.css" rel="stylesheet" type="text/css" />

              <title>KevChat Identity | Error</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
            </head>
            <body>
              <div
                class="w-full h-full flex flex-col justify-center items-center bg-base-300"
              >
                <article class="prose">
                  <h1 class="text-center">KevChat Identity</h1>
                  <div class="card card-dash bg-base-100 w-96">
                    <div class="card-body">
                      <h2 class="mt-0 mb-3">We hit an error:</h2>
                      <div
                        role="alert"
                        class="alert alert-error alert-soft flex flex-col gap-0 items-start"
                      >
                        ${Object.entries(out)
                          .map(
                            ([key, value]) => `
                        <p><strong>${key}</strong>: ${htmlSafe(value)}</p>
                        `,
                          )
                          .join('')}
                      </div>
                      <p class="mb-0">Please close this window & try again later.</p>
                    </div>
                  </div>
                </article>
              </div>
            </body>
          </html>
          `;
      },
    };
  }
}
